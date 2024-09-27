import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

// Superadmin, Admin, Superuser can create other users
export const createUser = AsyncHandler(async (req, res, next) => {
  const { username, password, role, email } = req.body;
  console.log("req users:", req.body);

  const emptyFields = ["username", "password", "role", "email"];

  const isEmptyFields = emptyFields.filter((field) => !req.body[field]?.trim());
  console.log("isEmptyFields:", isEmptyFields);

  if (isEmptyFields.length > 0) {
    return next(
      new ApiError(
        400,
        `${isEmptyFields.join(", ")} ${isEmptyFields.length > 1 ? "are" : "is"} required`,
      ),
    );
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    return next(new ApiError(400, "Email already registered"));
  }

  // Role validation
  if (
    req.user.role === "superAdmin" &&
    ["admin", "superUser", "user"].includes(role)
  ) {
    // Superadmin can create Admin, Superuser, and User
  } else if (
    req.user.role === "admin" &&
    ["superUser", "user"].includes(role)
  ) {
    // Admin can create Superuser and User
  } else if (req.user.role === "superUser" && role === "user") {
    // Superuser can only create User
  } else {
    return next(
      new ApiError(403, "you are not allowed to create this Role gg"),
    );
  }

  // Create user

  const newUser = new User({
    username,
    email,
    password,
    role,
    createdBy: req.user.id,
  });

  await newUser.save();
  return res
    .status(201)
    .json(
      new Apiresponse(
        201,
        newUser,
        `${req.user.role}  has been created ${role}`,
      ),
    );
});

// Get all users (Superadmin only)
export const getAllUsers = AsyncHandler(async (req, res, next) => {
  let users;
  if (req.user.role === "superAdmin") {
    users = await User.find();
  } else {
    users = await User.find({ createdBy: req.user._id });
  }
  if (!users) {
    return next(new ApiError(400, "No users found"));
  }
  return res
    .status(200)
    .json(
      new Apiresponse(
        201,
        { users, me: req.user },
        "users data fetched successfully",
      ),
    );
});

// Admin gets users they created
export const getCreatedUsers = AsyncHandler(async (req, res, next) => {
  const users = await User.find({ createdBy: req.user._id });
  if (!users) {
    return next(new ApiError(400, "No users found"));
  }
  return res
    .status(200)
    .json(
      new Apiresponse(
        201,
        { users, me: req.user },
        "users data fetched successfully",
      ),
    );
});
