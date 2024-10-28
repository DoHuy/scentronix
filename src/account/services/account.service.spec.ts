import { Test, TestingModule } from "@nestjs/testing";
import { UrlService } from "@/urls";
import { InputRepository } from "@/repository";
import { Input } from "@/entity";
import * as faker from "faker";
import { orderBy } from "lodash";
import { Logger } from "@nestjs/common";
import axios from "axios";
import { UrlInterface } from "@/urls";
import { CUSTOM_ERROR_CODE, REQUEST_ERROR, URL_ERROR_MESSAGE } from "@/common";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("UrlService", () => {
  let service: UrlInterface;

  const mockInputRepository = () => ({
    find: jest.fn()
  });

  let logger = ({
    log: jest.fn(),
    error: jest.fn()
  } as unknown) as Logger;

  // create mock data
  const mockInput: Input = {
    id: faker.datatype.uuid(),
    values: [
      {
        url: "https://does-not-work.perfume.new",
        priority: 1
      },
      {
        url: "https://gitlab.com",
        priority: 4
      },
      {
        url: "https://github.com",
        priority: 4
      },
      {
        url: "https://doesnt-work.github.com",
        priority: 4
      },
      {
        url: "http://app.scnt.me",
        priority: 3
      },
      {
        url: "https://offline.scentronix.com",
        priority: 2
      }
    ],
    createdAt: faker.datatype.datetime(),
    updatedAt: faker.datatype.datetime()
  };

  const mockActiveUrls = [
    {
      url: "https://gitlab.com",
      online: true
    },
    {
      url: "https://github.com",
      online: true
    },
    {
      url: "https://offline.scentronix.com",
      online: true
    }
  ];

  const mockActiveResponse = [
    {
      url: "https://gitlab.com",
      priority: 4
    },
    {
      url: "https://github.com",
      priority: 4
    },
    {
      url: "https://offline.scentronix.com",
      priority: 2
    }
  ];

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: InputRepository,
          useValue: mockInputRepository()
        },
        {
          provide: Logger,
          useValue: logger
        }
      ]
    }).compile();

    service = moduleRef.get<UrlService>(UrlService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("checkUrl", () => {
    it("should return true if URL is reachable and status code is 2xx", async () => {
      mockedAxios.get.mockResolvedValue({ status: 200 });
      const result = await service.checkUrl("https://example.com");
      expect(result).toBe(true);
    });
    it("should return false if URL is reachable but status code is not 2xx", async () => {
      mockedAxios.get.mockResolvedValue({ status: 404 });
      const result = await service.checkUrl("https://example.com");
      expect(result).toBe(false);
    });

    it("should return false if URL is not reachable", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Network Error"));
      const result = await service.checkUrl("https://example.com");
      expect(result).toBe(false);
    });

    it("should throw an exception if request times out", async () => {
      mockedAxios.get.mockRejectedValue({ code: "ECONNABORTED" });
      await expect(service.checkUrl("https://example.com")).rejects.toThrow(
        new Error(
          `${CUSTOM_ERROR_CODE.REQUEST_TIMEOUT}|${REQUEST_ERROR.TIMEOUT}`
        )
      );
    });
  });

  describe("findAll", () => {
    it("should not contain priority", async () => {
      service.getDataFromDatabase = jest.fn(async () => mockInput.values);
      service.checkUrls = jest.fn(async () => mockActiveUrls);
      const result = await service.findAll(undefined);

      expect(result).toEqual(
        orderBy(mockActiveResponse, ["priority"], ["asc"])
      );
    });

    it("should contain priority", async () => {
      service.getDataFromDatabase = jest.fn(
        () => new Promise(resolve => resolve(mockInput.values))
      );
      service.checkUrls = jest.fn(
        () => new Promise(resolve => resolve(mockActiveUrls))
      );
      const result = await service.findAll(2);
      expect(result).toEqual(
        orderBy(
          [mockActiveResponse[mockActiveResponse.length - 1]],
          ["priority"],
          ["asc"]
        )
      );
    });

    it("should throw urls not found", async () => {
      try {
        await service.findAll();
      } catch (e) {
        const err = e as Error;
        expect(err.message).toEqual(
          `${CUSTOM_ERROR_CODE.NOTFOUND}|${URL_ERROR_MESSAGE.NOTFOUND}`
        );
      }
    });
  });

  describe("checkUrls", () => {
    it("should return results for multiple URLs", async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ status: 200 }) // First URL
        .mockResolvedValueOnce({ status: 404 }); // Second URL

      const urls = ["https://example1.com", "https://example2.com"];
      const results = await service.checkUrls(urls);

      expect(results).toEqual([
        { url: "https://example1.com", online: true },
        { url: "https://example2.com", online: false }
      ]);
    });
  });
});
