import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model.js";
export interface AuthRequest extends Request {
  user?: {
    // req may have a "user" object
    role: string; // user has at least a "role" property
    [key: string]: any; // may also have other properties (like id, email, etc.)
  };
}

export const authMiddleware = async (req: AuthRequest,res: Response,next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No access token provided" });
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.isAdmin ? "admin" : "user",
    };
    next();
  } catch (error) {
    if ((error as any).name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token has expired" });
    }
    console.error("Error in authMiddleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const adminRoute = (req: AuthRequest,res: Response,next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};
