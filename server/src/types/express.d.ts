import { AuthenticatedUser } from "./index"; // Adjust the import according to your project structure

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}