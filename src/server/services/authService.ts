import { prisma } from '../../lib/prisma';
import { comparePassword } from '../utils/password';
import { generateToken, TokenPayload } from '../utils/jwt';

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string | null;
  };
}

class AuthService {
  async login(data: LoginDto): Promise<LoginResponse> {
    const { email, password } = data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const token = generateToken(tokenPayload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async getUserById(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }
}

export default new AuthService();

