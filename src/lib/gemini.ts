import { GoogleGenerativeAI } from "@google/generative-ai";
import { ProductInput, SalesPageOutput } from "@/types";
import { salesPageOutputSchema } from "./validations";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateSalesPage(
  data: ProductInput,
): Promise<SalesPageOutput> {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `You are an elite direct-response copywriter and conversion optimization expert.
Generate a high-converting sales page in strict JSON format based on the product information below.

Product Information:
${JSON.stringify(data, null, 2)}

Return ONLY a valid JSON object with NO markdown, NO backticks, NO explanation. Just raw JSON.

Required output structure:
{
  "headline": "Powerful, benefit-driven headline that speaks to the target audience's deepest desire (max 15 words)",
  "subheadline": "Supporting statement that adds credibility and expands on the headline (max 25 words)",
  "description": "Compelling 3-4 sentence description that paints a picture of transformation and addresses pain points",
  "benefits": ["5-7 specific, tangible benefits written as outcome statements starting with action verbs"],
  "features": ["5-7 key features written as capabilities, each explaining what the product does"],
  "socialProof": "A compelling social proof statement or testimonial-style quote that builds trust (include specific numbers if possible)",
  "pricing": "Value-focused pricing statement that justifies the price point of ${data.price}",
  "cta": "Action-oriented CTA button text (3-6 words, urgent and specific)",
  "painPoints": ["3-4 pain points the target audience feels that this product solves"],
  "guarantee": "Risk-reversal guarantee statement that removes buyer hesitation"
}

Make it emotionally resonant, specific, and conversion-focused. Write for ${data.targetAudience}.`;

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Clean up potential markdown wrapping
      text = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      // Extract JSON if wrapped in other text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate with Zod
      const validated = salesPageOutputSchema.safeParse(parsed);
      if (!validated.success) {
        console.error("Validation failed:", validated.error);
        attempts++;
        continue;
      }

      return validated.data as SalesPageOutput;
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error(
          `Failed to generate valid sales page after ${maxAttempts} attempts: ${error}`,
        );
      }
      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
    }
  }

  throw new Error("Failed to generate sales page");
}

export type RegenerableSection = keyof Pick<
  SalesPageOutput,
  | "headline"
  | "subheadline"
  | "description"
  | "benefits"
  | "features"
  | "socialProof"
  | "pricing"
  | "cta"
  | "painPoints"
  | "guarantee"
>;

const sectionInstructions: Record<RegenerableSection, string> = {
  headline:
    'Generate a NEW "headline": a powerful benefit-driven headline (max 15 words) different from the current one.',
  subheadline:
    'Generate a NEW "subheadline": a supporting statement expanding on the headline (max 25 words), different from the current one.',
  description:
    'Generate a NEW "description": a compelling 3-4 sentence product description that paints a transformation picture, different from the current one.',
  benefits:
    'Generate NEW "benefits": an array of 5-7 specific tangible benefits as outcome statements starting with action verbs, all different from the current ones.',
  features:
    'Generate NEW "features": an array of 5-7 key features as capabilities, all different from the current ones.',
  socialProof:
    'Generate NEW "socialProof": a fresh compelling social proof / testimonial-style quote with specific numbers if possible, different from the current one.',
  pricing:
    'Generate NEW "pricing": a fresh value-focused pricing statement that justifies the price, different from the current one.',
  cta: 'Generate a NEW "cta": a fresh action-oriented CTA button text (3-6 words, urgent and specific), different from the current one.',
  painPoints:
    'Generate NEW "painPoints": an array of 3-4 fresh pain points the audience feels, all different from the current ones.',
  guarantee:
    'Generate a NEW "guarantee": a fresh risk-reversal guarantee statement, different from the current one.',
};

export async function regenerateSections(
  input: ProductInput,
  currentOutput: string,
  sections: RegenerableSection[],
): Promise<Partial<SalesPageOutput>> {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const outputShape = sections.reduce(
    (acc, section) => {
      const examples: Record<RegenerableSection, string> = {
        headline: '""',
        subheadline: '""',
        description: '""',
        benefits: "[]",
        features: "[]",
        socialProof: '""',
        pricing: '""',
        cta: '""',
        painPoints: "[]",
        guarantee: '""',
      };
      acc[section] = examples[section];
      return acc;
    },
    {} as Record<string, string>,
  );

  const prompt = `You are an elite direct-response copywriter. Your job is to regenerate SPECIFIC sections of a sales page with FRESH, CREATIVE alternatives.

PRODUCT INFORMATION:
${JSON.stringify(input, null, 2)}

CURRENT SALES PAGE (for context — do NOT repeat any of this content):
${JSON.parse(currentOutput)}

TASK: Regenerate ONLY these sections with completely new, creative alternatives:
${sections.map((s) => `- ${s}: ${sectionInstructions[s]}`).join("\n")}

RULES:
- Return ONLY a valid JSON object with ONLY the requested keys
- NO markdown, NO backticks, NO explanation — just raw JSON
- Every value must be completely different from the current version
- Match the same tone, audience, and product context

Output JSON shape (fill in ONLY these keys):
{
${sections.map((s) => `  "${s}": ${outputShape[s]}`).join(",\n")}
}`;

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      text = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate that all requested sections are present
      const missing = sections.filter((s) => !(s in parsed));
      if (missing.length > 0)
        throw new Error(`Missing sections: ${missing.join(", ")}`);

      return parsed as Partial<SalesPageOutput>;
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error(
          `Failed to regenerate sections after ${maxAttempts} attempts: ${error}`,
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
    }
  }

  throw new Error("Failed to regenerate sections");
}
