import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { REQUEST_ERROR } from "@/common";

@Injectable()
export class TimeoutMiddleware implements NestMiddleware {
  private readonly timeoutMs = 50000; // Timeout in milliseconds

  use(_req: Request, res: Response, next: NextFunction) {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).send(REQUEST_ERROR.TIMEOUT);
      }
    }, this.timeoutMs);

    res.on("finish", () => clearTimeout(timer));
    next();
  }
}
