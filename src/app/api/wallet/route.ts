import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet not found" },
        { status: 404 }
      );
    }

    const pendingHold = await prisma.transaction.aggregate({
      where: {
        walletId: wallet.id,
        type: "ESCROW_HOLD",
        status: "PENDING",
      },
      _sum: { amount: true },
    });

    return NextResponse.json({
      wallet: {
        id: wallet.id,
        balance: Number(wallet.balance),
        pendingHold: Math.abs(Number(pendingHold._sum.amount) || 0),
        available: Number(wallet.balance) - Math.abs(Number(pendingHold._sum.amount) || 0),
      },
      transactions: wallet.transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: Number(t.amount),
        status: t.status,
        description: t.description,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, amount, type, description } = body;

    if (!userId || !amount || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet not found" },
        { status: 404 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: type.toUpperCase(),
        amount: type === "WITHDRAWAL" || type === "PAYMENT" ? -Math.abs(amount) : Math.abs(amount),
        status: "COMPLETED",
        description,
      },
    });

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          increment: type === "WITHDRAWAL" || type === "PAYMENT" ? -Math.abs(amount) : Math.abs(amount),
        },
      },
    });

    return NextResponse.json({
      transaction,
      message: "Transaction completed successfully",
    });
  } catch (error) {
    console.error("Error processing transaction:", error);
    return NextResponse.json(
      { error: "Failed to process transaction" },
      { status: 500 }
    );
  }
}
