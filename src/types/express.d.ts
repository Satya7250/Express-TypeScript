import { UserTokenPayload } from "../app/auth/utils/token";

declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload;
      tokenStatus?: "expired";
    }
  }
}

export {};