import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';
import { successResponse, errorResponse, createdResponse } from '@/lib/api/response';
import { ValidationError, ConflictError } from '@/lib/api/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      });
      throw new ValidationError('Validation failed', errors);
    }

    const { name, email, password, role } = result.data;
    const specialty = body.specialty;
    const phone = body.phone;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userRole = role === 'PROFESSIONAL' ? 'PROFESSIONAL' : 'PATIENT';

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: userRole,
        phone: phone || null,
        wallet: {
          create: {
            balance: 0,
            available: 0,
            pending: 0,
          },
        },
        ...(role === 'PROFESSIONAL' && {
          professional: {
            create: {
              title: `Dr. ${name}`,
              specialty: specialty || 'General Practice',
              consultationFee: 15000,
              yearsExperience: 0,
              languages: ['English'],
              verificationStatus: 'PENDING',
              isVirtual: true,
            },
          },
        }),
      },
      include: {
        wallet: true,
        professional: true,
      },
    });

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isAdmin: user.isAdmin,
    };

    return createdResponse({
      user: sessionUser,
      message: 'Registration successful',
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
