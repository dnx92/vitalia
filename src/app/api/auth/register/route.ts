import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, specialty, phone, state } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userRole = role === "professional" ? "PROFESSIONAL" : "PATIENT";

    const user = await prisma.user.create({
      data: {
        email,
        name: name,
        role: userRole,
        phone: phone || null,
        wallet: {
          create: {},
        },
        ...(role === "professional" && {
          professional: {
            create: {
              title: "Dr. " + name,
              specialty: specialty || "General Practice",
              hourlyRate: 150,
              yearsExperience: 5,
              languages: ["English"],
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

    return NextResponse.json({
      user: sessionUser,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
