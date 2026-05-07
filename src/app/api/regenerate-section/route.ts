import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { regenerateSections } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { SalesPageOutput } from "@/types";
import { z } from "zod";
import { productInputSchema } from "@/lib/validations";

const requestSchema = z.object({
  pageId: z.string(),
  sections: z
    .array(
      z.enum([
        "headline",
        "subheadline",
        "description",
        "benefits",
        "features",
        "socialProof",
        "pricing",
        "cta",
        "painPoints",
        "guarantee",
      ]),
    )
    .min(1),
  inputData: productInputSchema,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    const { pageId, sections, inputData } = parsed.data;

    const page = await prisma.salesPage.findFirst({
      where: { id: pageId, userId: session.user.id },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const currentOutput = page.outputData;
    const regenerated = await regenerateSections(
      inputData,
      currentOutput,
      sections,
    );

    const parsedOutput = JSON.parse(currentOutput);
    const mergedOutput: SalesPageOutput = { ...parsedOutput, ...regenerated };

    await prisma.salesPage.update({
      where: { id: pageId },
      data: { outputData: JSON.stringify(mergedOutput) },
    });

    return NextResponse.json({ output: mergedOutput, regenerated });
  } catch (error) {
    console.error("Section regenerate error:", error);
    return NextResponse.json(
      { error: "Failed to regenerate sections. Please try again." },
      { status: 500 },
    );
  }
}
