import { Request, Response } from "express";
import User, { IUser } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../config/redis.js";

const generateTokens = (id: string): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(
    { id },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    { id },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId: string, refreshToken: string) => {
  await redis.set(`refreshToken:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7 days expiration
};

const setCookies = (res:Response, accessToken:string, refreshToken:string) => {
  res.cookie("accessToken",accessToken,{
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    sameSite:"strict",
    maxAge:15 * 60 * 1000 //15 minutes
  });
  res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    sameSite:"strict",
    maxAge:7 * 24 * 60 * 60 * 1000 //7 days
  });
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    //check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //create new user
    const user = (await User.create({ name, email, password })) as IUser;

    const { accessToken, refreshToken } = generateTokens(String(user._id));
		await storeRefreshToken(String(user._id), refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  } catch (error : any) {
    console.error("Error in registerUser controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //check for user email
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(String(user._id));
      await storeRefreshToken(String(user._id), refreshToken);
      setCookies(res, accessToken, refreshToken);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error : any) {
    console.error("Error in loginUser controller", error);
    res.status(500).json({ message: error.message });//500 means server error
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken){
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
      await redis.del(`refreshToken:${(decoded as any).id}`);
    }
    res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.status(200).json({ message: "Logged out successfully" });
  } catch (error:any) {
    console.error("Error in logoutUser controller", error);
    res.status(500).json({ message: error.message });
  }
}

//TODO : refresh access token