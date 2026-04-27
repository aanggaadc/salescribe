import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateSalesPage } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { ProductInput } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const page = await prisma.salesPage.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.salesPage.deleteMany({
      where: { id: params.id, userId: session.user.id },
    });

    return NextResponse.json({ message: "Page deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, template } = body;

    const existingPage = await prisma.salesPage.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!existingPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    if (action === "regenerate") {
      const input: ProductInput = JSON.parse(existingPage.inputData);

      const output = await generateSalesPage(input);

      const updated = await prisma.salesPage.update({
        where: { id: params.id },
        data: { outputData: JSON.stringify(output) },
      });

      return NextResponse.json({ page: updated });
    }

    if (template) {
      const updated = await prisma.salesPage.update({
        where: { id: params.id },
        data: { template },
      });
      return NextResponse.json({ page: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Patch page error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
