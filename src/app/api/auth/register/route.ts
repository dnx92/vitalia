import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, specialty, languages, phone, country } = body;

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

    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: role === "professional" ? "PROFESSIONAL" : "PATIENT",
      specialty: role === "professional" ? specialty : null,
      languages: role === "professional" ? languages : [],
      phone: phone || null,
      country: country || null,
      avatar: null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      user,
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
