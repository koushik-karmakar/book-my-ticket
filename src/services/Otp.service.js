import nodemailer from "nodemailer";
import OtpModel from "../models/Otp.model.js";

class OtpService {
  #generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(email) {
    const otp = this.#generateOtp();
    await OtpModel.create(email, otp);
    await this.#sendEmail(email, otp);
    return otp;
  }

  async verifyOtp(email, otp) {
    const record = await OtpModel.findByEmail(email);
    if (!record) return { success: false, message: "OTP expired or not found" };
    if (record.otp !== otp) return { success: false, message: "Invalid OTP" };
    await OtpModel.deleteByEmail(email);
    return { success: true };
  }

  async #sendEmail(email, otp) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"Book My Ticket" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Book My Ticket",
      html: `
        <h2>Your OTP is: <strong>${otp}</strong></h2>
        <p>This OTP is valid for 5 minutes.</p>
        <p>Do not share this with anyone.</p>
      `,
    });
  }
}

export default new OtpService();