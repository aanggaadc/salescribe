import { GoogleGenerativeAI } from "@google/generative-ai";
import { ProductInput, SalesPageOutput } from "@/types";
import { salesPageOutputSchema } from "./validations";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateSalesPage(
  data: ProductInput
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
      text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

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
          `Failed to generate valid sales page after ${maxAttempts} attempts: ${error}`
        );
      }
      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
    }
  }

  throw new Error("Failed to generate sales page");
}
