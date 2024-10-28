import { Test, TestingModule } from "@nestjs/testing";
import { accountService } from "@/urls";
import { UrlController } from "./account.controller";
import { orderBy } from "lodash";
import {
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";
import * as faker from "faker";
import { CUSTOM_ERROR_CODE, URL_ERROR_MESSAGE } from "@/common";
import { AccountInterface } from "@/urls";

describe("Account Controller", () => {
  let controller: UrlController;
  let accountService: UrlInterface;

  const mockAccountService = () => ({
    findAll: jest.fn()
  });

  //mock data
  const mockData = [
    { url: faker.internet.url(), priority: 1 },
    {
      url: faker.internet.url(),
      priority: faker.datatype.number({ min: 1, max: 50 })
    },
    {
      url: faker.internet.url(),
      priority: faker.datatype.number({ min: 1, max: 50 })
    },
    {
      url: faker.internet.url(),
      priority: faker.datatype.number({ min: 1, max: 50 })
    },
    {
      url: faker.internet.url(),
      priority: faker.datatype.number({ min: 1, max: 50 })
    },
    {
      url: faker.internet.url(),
      priority: faker.datatype.number({ min: 1, max: 50 })
    }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        accountService,
        {
          provide: accountService,
          useValue: mockAccountService()
        }
      ]
    }).compile();

    controller = module.get<AccountController>(AccountController);
    accountService = module.get<AccountService>(AccountService);
  });

  it("should be defined", async () => {
    expect(controller).toBeDefined();
  });

  describe("findAll not contain priority", () => {
    it("return data", async () => {
      accountService.findAll = jest.fn(
        async () =>
          new Promise(resolve =>
            resolve(orderBy(mockData, ["priority"], ["asc"]))
          )
      );
      const result = await controller.findAll({});
      expect(result).toEqual(orderBy(mockData, ["priority"], ["asc"]));
    });

    it("not found", async () => {
      accountService.findAll = jest.fn().mockImplementation(() => {
        throw new Error(
          `${CUSTOM_ERROR_CODE.NOTFOUND}|${URL_ERROR_MESSAGE.NOTFOUND}`
        );
      });

      try {
        await controller.findAll({});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });

    describe("findAll contain priority", () => {
      it("return data", async () => {
        accountService.findAll = jest.fn(
          () => new Promise(resolve => resolve([mockData[0]]))
        );
        const result = await controller.findAll({ priority: 1 });
        expect(result).toEqual([mockData[0]]);
      });

      it("not found", async () => {
        accountService.findAll = jest.fn().mockImplementation(() => {
          throw new Error(
            `${CUSTOM_ERROR_CODE.NOTFOUND}|${URL_ERROR_MESSAGE.NOTFOUND}`
          );
        });

        try {
          await controller.findAll({ priority: 51 });
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
        }
      });

      it("internal server error", async () => {
        accountService.findAll = jest.fn().mockImplementation(() => {
          throw new Error("database timeout");
        });

        try {
          await controller.findAll({ priority: 51 });
        } catch (e) {
          expect(e).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });
});
