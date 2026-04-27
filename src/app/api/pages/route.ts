import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SavedPageRaw } from "@/types";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pages = await prisma.salesPage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        productName: true,
        template: true,
        createdAt: true,
        updatedAt: true,
        outputData: true,
        inputData: true,
      },
    });

    const parsedPages = pages.map((page: SavedPageRaw) => {
      let parsedOutput = null;
      let parsedInput = null;

      try {
        parsedOutput = page.outputData ? JSON.parse(page.outputData) : null;
      } catch (e) {
        console.error("Failed to parse outputData:", e);
      }

      try {
        parsedInput = page.inputData ? JSON.parse(page.inputData) : null;
      } catch (e) {
        console.error("Failed to parse inputData:", e);
      }

      return {
        ...page,
        outputData: parsedOutput,
        inputData: parsedInput,
      };
    });

    return NextResponse.json({
      pages: parsedPages,
    });
  } catch (error) {
    console.error("Get pages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
