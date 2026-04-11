import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations';
import { successResponse, errorResponse, createdResponse } from '@/lib/api/response';
import { ValidationError, UnauthorizedError, ConflictError } from '@/lib/api/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      });
      throw new ValidationError('Validation failed', errors);
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { professional: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      isAdmin: user.isAdmin,
    };

    return successResponse({
      user: sessionUser,
      message: 'Login successful',
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
