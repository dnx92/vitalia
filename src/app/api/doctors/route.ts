import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get("specialty");
    const location = searchParams.get("location");
    const rating = searchParams.get("rating");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: any = {
      verificationStatus: "APPROVED",
    };

    if (specialty) {
      where.specialty = { contains: specialty, mode: "insensitive" };
    }

    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    if (rating) {
      where.rating = { gte: parseFloat(rating) };
    }

    const [professionals, total] = await Promise.all([
      prisma.professional.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { rating: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          services: {
            where: { isActive: true },
            take: 1,
          },
        },
      }),
      prisma.professional.count({ where }),
    ]);

    const doctors = professionals.map((p) => ({
      id: p.id,
      name: p.user.name || "Unknown",
      email: p.user.email,
      image: p.user.image,
      specialty: p.specialty,
      title: p.title,
      bio: p.bio,
      location: "US",
      rating: p.rating ? Number(p.rating) : 0,
      reviewCount: p.reviewCount,
      languages: p.languages,
      price: p.services[0] ? Number(p.services[0].price) : 15000,
      verified: p.verificationStatus === "APPROVED",
      nextAvailable: "Today",
    }));

    return NextResponse.json({
      doctors,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
