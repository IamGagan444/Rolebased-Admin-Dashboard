import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const userRegistration = AsyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Required fields
  const fields = ["username", "email", "password"];

  // Check for missing fields
  const isEmptyField = fields.filter((field) => !req.body[field]?.trim()); // Checks for empty values
  if (isEmptyField.length > 0) {
    return next(
      new ApiError(
        400,
        `${isEmptyField.join(", ")} ${isEmptyField.length > 1 ? "are" : "is"} required!`,
      ),
    );
  }

  // Check if SuperAdmin exists
  const isSuperAdminExist = await User.findOne({ role: "superAdmin" });

  // Determine the user's role: the first user should be SuperAdmin, others default to User
  const userRole = !isSuperAdminExist ? "superAdmin" : "user";

  // Check if email is already registered
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return next(new ApiError(401, "Email has already been registered"));
  }

  // Create the new user
  const user = await User.create({
    username,
    email,
    password,
    role: userRole,
    createdBy: req.user ? req.user.id : null, // Set creator if exists
  });
  console.log(user);
  // Return created user without password
  const data = await User.findById(user._id).select("-password");

  return res
    .status(201)
    .json(new Apiresponse(201, data, "User registered successfully"));
});

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken =await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating tokens");
  }
};

const userLogin = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, "email and password are required"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError(404, "user not found"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return next(new ApiError(401, "invalid password"));
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);
  console.log(accessToken, refreshToken);
  const options = {
    httpOnly: true,
    secure: true,
  };


  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new Apiresponse(200, {
      users: user,
      accessToken,
      refreshToken,
    } ,"user loggedin successfully",),
  );
});

export { userRegistration, userLogin };
