import { applyDecorators, UseGuards } from "@nestjs/common";

import { ApiKeyGuard } from "@/auth";

export function ApiSecurity(): any {
  return applyDecorators(UseGuards(ApiKeyGuard));
}
