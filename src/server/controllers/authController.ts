import { Request, Response, NextFunction } from 'express';
import authService, { LoginDto } from '../services/authService';

class AuthController {
  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: LoginDto = req.body;

      if (!data.email || !data.password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const result = await authService.login(data);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Invalid email or password') {
        res.status(401).json({ error: error.message });
        return;
      }
      next(error);
    }
  }
}

export default new AuthController();

