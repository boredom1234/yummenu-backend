import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      auth0Id?: string;
      userId?: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH_AUDIENCE,
  issuerBaseURL: process.env.AUTH_ISSUER_URL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => { // Ensure the return type is Promise<void>
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    if (!decoded || !decoded.sub) {
      res.status(401).json({ message: "Invalid token" });
    }

    const auth0Id = decoded.sub;
    const user = await User.findOne({ auth0Id });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // Ensure user._id is treated as a string
    req.auth0Id = auth0Id as string;
    req.userId = (user._id as string).toString();
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Error parsing JWT:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
