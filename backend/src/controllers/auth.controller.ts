import { Request, Response } from "express";
import User, { IUser } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (id: string): { accessToken: string; refreshToken: string } => {
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

    //return user info and JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(String(user._id)),
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
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(String(user._id)),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error : any) {
    console.error("Error in loginUser controller", error);
    res.status(500).json({ message: error.message });//500 means server error
  }
};
