import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { REQUEST_ERROR } from "@/common";

@Injectable()
export class TimeoutMiddleware implements NestMiddleware {
  private readonly timeoutMs = 20000; // Timeout in 20s milliseconds

  use(_req: Request, res: Response, next: NextFunction) {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(HttpStatus.REQUEST_TIMEOUT).send(REQUEST_ERROR.TIMEOUT);
      }
    }, this.timeoutMs);

    res.on("finish", () => clearTimeout(timer));
    next();
  }
}
