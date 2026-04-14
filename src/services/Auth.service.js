import bcrypt from "bcryptjs";
import UserModel from "../models/User.model.js";
import OtpService from "./Otp.service.js";
import jwt from "jsonwebtoken";
import RefreshTokenModel from "../models/RefreshToken.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

class AuthService {
  async register({ full_name, last_name, email, password }) {
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      const err = new Error("Email already registered");
      err.status = 409;
      throw err;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await UserModel.create({ full_name, last_name, email, password: hashed });
    await OtpService.sendOtp(email);
    return user;
  }

  async verifyOtp(email, otp) {
    const result = await OtpService.verifyOtp(email, otp);
    if (!result.success) {
      const err = new Error(result.message);
      err.status = 400;
      throw err;
    }
    await UserModel.markVerified(email);
    return { success: true, message: "Email verified successfully" };
  }

  async resendOtp(email) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      const err = new Error("Email not registered");
      err.status = 404;
      throw err;
    }
    await OtpService.sendOtp(email);
    return { success: true, message: "OTP resent successfully" };
  }

  async login({ email, password }) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      const err = new Error("Invalid email or password");
      err.status = 401;
      throw err;
    }

    if (!user.is_verified) {
      const err = new Error("Please verify your email first");
      err.status = 403;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Invalid email or password");
      err.status = 401;
      throw err;
    }

    const access_token = generateAccessToken(user);
    const refresh_token = generateRefreshToken(user);

    await RefreshTokenModel.create(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
      user: { id: user.id, full_name: user.full_name, email: user.email },
    };
  }

  async refresh(token) {
    if (!token) {
      const err = new Error("Refresh token required");
      err.status = 401;
      throw err;
    }

    const saved = await RefreshTokenModel.findByToken(token);
    if (!saved) {
      const err = new Error("Invalid or expired refresh token. Please login again.");
      err.status = 401;
      throw err;
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      await RefreshTokenModel.deleteByToken(token);
      const err = new Error("Refresh token tampered. Please login again.");
      err.status = 401;
      throw err;
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      const err = new Error("User not found");
      err.status = 401;
      throw err;
    }

    const access_token = generateAccessToken(user);

    return { access_token };
  }

  async logout(token, userId) {
    if (token) {
      await RefreshTokenModel.deleteByToken(token);
    } else {
      await RefreshTokenModel.deleteByUser(userId);
    }
    return { success: true, message: "Logged out successfully" };
  }
}



export default new AuthService();