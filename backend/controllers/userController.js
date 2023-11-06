/**
 * the controller is where the logic goes
 * this logic in conjunction with the routes is what allows a user to proceed through the navigation, or not
 *
 * Big Picture:
 * - userController.js functions
 * - authMiddleware.js - verify authentication through proceedures before routing complete (like the General)
 * - userRoutes.js - establishes routing paths, where the local-root '/' is equal to /api/users, established in the server.js file
 * - server.js - defines the main url pathways, from root '/' to the first immediate route
 */

import mongoose from "mongoose";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
// authentication
import generateToken from "../utils/generateToken.js";

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  // destructure the request body
  const { email, password } = req.body;
  // find user
  const user = await User.findOne({ email: email });
  // if user found, respond with user details
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    //
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    // unauthorized status
    res.status(401);
    // res.status(401).json({message: "invalid email and/or password"});
    throw new Error(
      "Invalid email and/or password"
    );
  }
});

// @desc Register user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  // destructure user data from request body object, ultiately from ui form
  const { name, email, password } = req.body;
  // check User model for already existing user by comparing email address
  const userExists = await User.findOne({ email });
  // if user already exists, no need to re-register user
  if (userExists) {
    res.status(400); // client(user) error - cannot re-register existing user
    throw new Error("User already exists");
  }
  // create/register new user
  const user = await User.create({
    name,
    email,
    password,
  });
  // if user creation/registration successfull, authenticate user with a JWT for 30days
  if (user) {
    generateToken(res, user._id);
    // response - status 201 = everything good and something was created
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Logout user / clear cookie
// @route POST /api/users/logout
// @access Private (bc must be signed in to logout)
const logoutUser = asyncHandler(async (req, res) => {
  // get rid of the jwt cookie
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  //
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  // get user - NOTE: when logged in, you have access to req.user
  const user = await User.findById(req.user._id);
  // if user true, then response with json of user profile (except password)
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Update user profile
// @route PUT /api/users/profile (NOTICE: don't need :id bc will use token)
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // console.log(req.body.name);
  // get user from all users
  const user = await User.findById(req.user._id);
  // check, then update
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    // if passwords update required, then update password because password in db is hashed, so only mess if need be
    if (req.body.password) {
      user.password = req.body.password;
    }
    //
    const updatedUser = await user.save();
    //
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Get users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  // confirm user to be deleted exists by finding it
  const user = await User.findById(req.params.id);
  //
  if (user) {
    // ensure cannot delete user if Admin
    if (user.isAdmin) {
      // 400 - client error
      res.status(400);
      throw new Error("Cannot delete an admin user");
    }
    await User.deleteOne({_id: user._id});
    res.status(200).json({message: "User deleted successfully"});
  } else {
    res.status(404);
    throw new Error("User not found")
  }
});

// @desc Get user by id
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  // get particular user data except their password
  const user = await User.findById(req.params.id).select("-password");
  //
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  //
  const user = await User.findById(req.params.id);
  //
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin)
    //
    const updatedUser = await user.save()
    //
    res.status(200);
    // recreate user data object
    res.json({
      _id: updatedUser._id, // QUESTION: why are we even touching the id?
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
