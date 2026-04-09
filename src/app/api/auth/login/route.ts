import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const mockUsers = [
  {
    id: "1",
    email: "demo@vitalia.com",
    password: "demo123",
    name: "Demo User",
    role: "PATIENT" as const,
    avatar: null,
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = mockUsers.find((u) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
