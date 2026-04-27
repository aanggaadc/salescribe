import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateSalesPage } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { productInputSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = productInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const output = await generateSalesPage(parsed.data);

    // Save to database
    const page = await prisma.salesPage.create({
      data: {
        userId: session.user.id,
        productName: parsed.data.productName,
        inputData: JSON.stringify(parsed.data),
        outputData: JSON.stringify(output),
        template: body.template || "modern",
      },
    });

    return NextResponse.json({ output, pageId: page.id });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate sales page. Please try again." },
      { status: 500 }
    );
  }
}
