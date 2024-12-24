import jwt from "jsonwebtoken"
import User, { IUser } from "@models/User"

interface RequestInput {
    email: String,
    password: String,
    name: String
}

interface LoginInput {
    email: string;
    password: string;
}

export class AuthService {
    private readonly JWT_SECRET_KEY: string
    private readonly JWT_EXPIRES_IN: string 

    constructor() {
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || ""
        this.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || ""
    }
    
    private generateToken(userId: string): string {
        return jwt.sign({ userId }, this.JWT_SECRET_KEY, {
          expiresIn: this.JWT_EXPIRES_IN
        });
      }

      async me(userId: string): Promise<IUser | null> {
        console.log("userId",userId)
        return await User.findById(userId) || null;
      }

      async register(userData: RequestInput): Promise<{ user: IUser; token: string }> {
        try {
            console.log(userData)
          // Check if user already exists
          const existingUser = await User.findOne({ email: userData.email });
          
          if (existingUser) {
            throw new Error('Email already registered');
          }
          
          // Create new user
          const user = new User(userData);
          await user.save();
          console.log("heloo")
          // Generate token
          const token = this.generateToken(user._id as string);
    
          return {
            user: {
              ...user.toJSON(),
            } as IUser,
            token
          };
        } catch (error) {
          console.log(error);
          throw error
        }
      }

      async login(loginData: LoginInput): Promise<{ user: IUser; token: string }> {
        try {
          // Find user
          const user = await User.findOne({ email: loginData.email });
          if (!user) {
            throw new Error('Invalid credentials');
          }
    
          // Check password
          const isValidPassword = await user.comparePassword(loginData.password);
          if (!isValidPassword) {
            throw new Error('Invalid credentials');
          }
    
          // Generate token
          const token = this.generateToken(user._id as string);
    
          return {
            user: {
              ...user.toJSON(),
            } as IUser,
            token
          };
        } catch (error) {
          throw error;
        }
      }
    
      async validateToken(token: string): Promise<string> {
        try {
          const decoded = jwt.verify(token, this.JWT_SECRET_KEY) as { userId: string };
          return decoded.userId;
        } catch (error) {
          throw new Error('Invalid token');
        }
      }

}


