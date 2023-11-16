import { SetMetadata } from "@nestjs/common/decorators/core";

export const AuthorizeRoles = (...roles: string[]) => SetMetadata('allowedroles', roles);