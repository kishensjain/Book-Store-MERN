import jwt from "jsonwebtoken";

export const generateVerificationToken = (userId: string) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" } // token valid for 1 hour
  );
};
