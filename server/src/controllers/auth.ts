import { Request,Response } from "express";
import { AuthService } from "@/services/auth";

export class AuthController {
    private authService: AuthService;
  
    constructor() {
      this.authService = new AuthService();
     
    }

    me = async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.userId as string
        const user = await this.authService.me(userId);
        res.status(200).json(user);
      } catch (error) {
        res.status(400).json({
          message: error instanceof Error ? error.message : 'User not found'
        });
      }
    };
  
    register = async (req: Request, res: Response): Promise<void> => {
      try {
        const { user, token } = await this.authService.register(req.body);
        res.status(201).json({ user, token });
      } catch (error) {
        res.status(400).json({
          message: error instanceof Error ? error.message : 'Registration failed'
        });
      }
    };
  
    login = async (req: Request, res: Response): Promise<void> => {
      try {
        const { user, token } = await this.authService.login(req.body);
        res.status(200).json({ user, token });
      } catch (error) {
        res.status(401).json({
          message: error instanceof Error ? error.message : 'Login failed'
        });
      }
    };
  }