import { NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";

// Enhanced mock data generator with more realistic variations
function generateMockVariations(
  input: string,
  tone: string,
  length: string
): string[] {
  const toneTemplates = {
    Friendly: [
      `✨ ${input} - Made Simple & Easy`,
      `😊 Discover ${input} That Actually Works`,
      `🎉 Transform Your Life with ${input}`,
    ],
    Professional: [
      `• ${input} - Industry-Leading Solutions`,
      `→ Professional ${input} Services`,
      `✓ Trusted ${input} for Business Growth`,
    ],
    Playful: [
      `🚀 ${input} Just Got a Whole Lot Better!`,
      `💡 The Fun Way to ${input}`,
      `🌟 ${input} That'll Make You Smile`,
    ],
    Urgent: [
      `⚡ ${input} - Limited Time Only!`,
      `🔥 Don't Miss Out on ${input}`,
      `⏰ ${input} - Act Now Before It's Gone`,
    ],
  };

  const baseVariations = toneTemplates[tone as keyof typeof toneTemplates] || [
    `${input} - Get Started Today`,
    `Try ${input} Risk-Free`,
    `${input} - Simple. Effective. Proven.`,
  ];

  // Adjust length based on preference
  return baseVariations.map((variation) => {
    const words = variation.split(" ");
    const targetLength = length === "short" ? 5 : length === "medium" ? 8 : 12;
    return words.slice(0, Math.min(words.length, targetLength)).join(" ");
  });
}

// Modern Hugging Face Inference API integration using InferenceClient
async function generateWithHuggingFace(
  input: string,
  tone: string,
  length: string
): Promise<string[]> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing HUGGINGFACE_API_KEY");
  }

  // Initialize the Hugging Face client
  const client = new InferenceClient(apiKey);

  try {
    // Using chat completion with nebius provider
    const chatCompletion = await client.chatCompletion({
      provider: "nebius",
      model: "google/gemma-2-2b-it",
      messages: [
        {
          role: "system",
          content: `You are an expert marketing copywriter. Generate exactly 3 ${tone.toLowerCase()} marketing headlines for the given product/service. Make them ${length} in length. Return only the headlines, numbered 1-3.`,
        },
        {
          role: "user",
          content: `Product/Service: ${input}

Create 3 ${tone.toLowerCase()} ${length} marketing headlines for "${input}". Format:
1. [headline]
2. [headline]
3. [headline]`,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    // Extract the generated content
    const generatedText = chatCompletion.choices[0]?.message?.content || "";

    if (!generatedText) {
      throw new Error("No content generated from Hugging Face");
    }

    // Parse the response to extract headlines
    const lines = generatedText
      .split(/\n/)
      .map((line: string) =>
        line
          .replace(/^\d+\.?\s*[-•]?\s*/, "") // Remove numbering
          .replace(/^["\[\]]*/, "") // Remove quotes/brackets
          .replace(/["\[\]]*$/, "") // Remove quotes/brackets
          .replace(/\*+/g, "") // Remove asterisks (markdown formatting)
          .trim()
      )
      .filter(
        (line: string) =>
          line.length > 10 &&
          line.length < 200 &&
          !line.toLowerCase().includes("headline") &&
          !line.toLowerCase().includes("marketing")
      )
      .slice(0, 3);

    // If we don't get enough valid headlines, enhance with smart variations
    while (lines.length < 3) {
      const mockVariations = generateMockVariations(input, tone, length);
      const missingIndex = lines.length;
      lines.push(mockVariations[missingIndex] || `${input} - ${tone} Solution`);
    }

    return lines;
  } catch (error) {
    console.error("InferenceClient error:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { input, tone, length } = await request.json();

    console.log("Generating variations for:", { input, tone, length });

    if (!input?.trim()) {
      return NextResponse.json(
        { error: "Input text is required" },
        { status: 400 }
      );
    }

    let variations: string[];
    let isMock = false;
    let message = "";

    try {
      // Try Hugging Face first
      variations = await generateWithHuggingFace(input, tone, length);
      message = "Generated with Hugging Face AI";
    } catch (error) {
      console.log("Hugging Face failed, using enhanced mock data:", error);
      // Fallback to enhanced mock data
      variations = generateMockVariations(input, tone, length);
      isMock = true;
      message = "Using enhanced demo data - Check your Hugging Face API key";
    }

    return NextResponse.json({
      variations,
      isMock,
      message,
      provider: isMock ? "mock" : "huggingface",
    });
  } catch (err) {
    console.error("Generation failed:", err);

    // Final fallback to mock data
    try {
      const { input, tone, length } = await request.json();
      const variations = generateMockVariations(
        input || "Product",
        tone || "Friendly",
        length || "short"
      );

      return NextResponse.json({
        variations,
        isMock: true,
        message: "Using demo data - Service temporarily unavailable",
        provider: "mock",
      });
    } catch {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }
  }
}
