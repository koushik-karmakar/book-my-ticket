import AuthService from "../services/Auth.service.js";
class AuthController {
  async register(req, res, next) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: "Registered successfully. OTP sent to your email.",
        data: user,
      });
    } catch (err) { next(err); }
  }

  async verifyOtp(req, res, next) {
    try {
      const { email, otp } = req.body;
      const result = await AuthService.verifyOtp(email, otp);
      res.status(200).json(result);
    } catch (err) { next(err); }
  }

  async resendOtp(req, res, next) {
    try {
      const { email } = req.body;
      const result = await AuthService.resendOtp(email);
      res.status(200).json(result);
    } catch (err) { next(err); }
  }

  async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async refresh(req, res, next) {
    try {
      const token = req.body.refresh_token || req.cookies?.refresh_token;
      const result = await AuthService.refresh(token);
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async logout(req, res, next) {
    try {
      const token = req.body.refresh_token || req.cookies?.refresh_token;
      const result = await AuthService.logout(token, req.user.id);
      res.status(200).json(result);
    } catch (err) { next(err); }
  }

  async me(req, res) {
    res.status(200).json({ success: true, data: req.user });
  }
}

export default new AuthController();