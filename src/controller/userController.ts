import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { BadRequest, NotFound } from "../util/AppError";
import { userSchema } from "../util/validate/userSchema";

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  const { error } = userSchema.validate(req.body);
  if (error) throw new BadRequest(error.details[0].message);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { username, email, role },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user" });
  }
};

// Get a user by ID
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) throw new NotFound("User not found");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res
      .status(error instanceof NotFound ? 404 : 500)
      .json({ message: "user not found" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

// Update a user by ID
export const updateUser = async (req: Request, res: Response) => {
  const { username, email, role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) throw new NotFound("User not found");
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    res
      .status(error instanceof NotFound ? 404 : 500)
      .json({ message: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) throw new NotFound("User not found");
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    res
      .status(error instanceof NotFound ? 404 : 500)
      .json({ message: error.message });
  }
};
