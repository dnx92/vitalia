import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalUsers,
      totalProfessionals,
      pendingVerifications,
      totalTransactions,
      recentUsers,
      recentTransactions,
      professionalsBySpecialty,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.professional.count(),
      prisma.professional.count({ where: { verificationStatus: "PENDING" } }),
      prisma.transaction.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.transaction.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { wallet: { select: { user: { select: { name: true, email: true } } } } },
      }),
      prisma.professional.groupBy({
        by: ["specialty"],
        _count: true,
      }),
    ]);

    const totalVolume = await prisma.transaction.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProfessionals,
        pendingVerifications,
        totalTransactions,
        totalVolume: totalVolume._sum.amount || 0,
      },
      recentUsers,
      recentTransactions,
      professionalsBySpecialty: professionalsBySpecialty.map((s) => ({
        specialty: s.specialty,
        count: s._count,
      })),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
