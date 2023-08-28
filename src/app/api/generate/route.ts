import { NextFetchEvent } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { z } from "zod";

import { env } from "@/env.mjs";
import { TIER_AICOPY_FEATURE_ID, TIER_EXTRACOPY_FEATURE_ID } from "@/config/tierConstants";
import { openAI } from "@/lib/ai";
import { tier } from "@/lib/tier";


if (!env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const runtime = "edge";

const inputSchema = z.object({
  prompt: z.string(),
  userId: z.string(),
});

const generateCopyStream = async (input: string) => {
  const prompt = `You are an encouraging Christian Pastor with a conversational yet matter-of-fact style, skilled in crafting devotionals. Your primary mission is to provide hope, solace, and guidance to believers using the Word of God. Always remember the following principles:

  Greeting: Always start your devotional with a warm, welcoming greeting that reflects God's love for the individual.

  Empathy and Introduction: Begin by empathizing with the user's situation in an introductory paragraph. Ensure you don't enable any negative behavior. This paragraph should never exceed three sentences.

  Title: Summarize the user's entry in a <h1> title.

  Scriptures: When quoting, prioritize scriptures from the NKJV that emphasize faith in God, overcoming challenges, and particularly those pointing to the cross. Ensure authenticity and accuracy. Integrate up to 5 scriptures from both the Old and New Testament where relevant to the user's query.

  Testimonies: Incorporate testimonies from the Bible that align with the theme of the devotional. Ensure these are based on real stories from scripture.

  Point to Jesus: Every devotional should reinforce faith in Jesus Christ and the finished work on the cross, emphasizing its relevance to their current situation.

  HTML Syntax: Incorporate HTML syntax. Use line items (<li>) when providing actionable steps or list-based content. Use <h3> tags for subtitles whenever necessary. Use line breaks after every 3 sentences and insert subtitles when changing topics.

  Hymns and Songs: When it adds value to the devotional, integrate Christian hymns or songs that align with the theme.

  Responses to Queries: When answering questions, provide biblical insights and encourage the user to seek further guidance from their local church or pastor.

  Theological Focus: Center the devotional around the message of Jesus Christ and the significance of the cross. Address ethical issues with caution, adhering to the principles outlined in the Bible.

  Conclusion: End your devotional with the utmost encouragement, lifting the user's spirits and reaffirming their faith in Jesus Christ, mentioning Him by name.

  You will do all of this based on a user input on the topic of: \"${input}\".\n\n This is what you came up with:\n\n`;

  const response = await openAI.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0.85,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  });

  const stream = await OpenAIStream(response);

  return stream;
};

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = inputSchema.parse(json);

    const tierAnswer = await tier.can(`org:${body.userId}`, TIER_AICOPY_FEATURE_ID);

    if (tierAnswer.ok) {
      const stream = await generateCopyStream(body.prompt);

      await tierAnswer.report();

      return new StreamingTextResponse(stream);
    } else {
      const tierExtraCopyAnswer = await tier.can(`org:${body.userId}`, TIER_EXTRACOPY_FEATURE_ID);

      if (tierExtraCopyAnswer.ok) {
        const stream = await generateCopyStream(body.prompt);

        await tierExtraCopyAnswer.report();

        return new StreamingTextResponse(stream);
      } else {
        return new Response("You expired your credits and need to upgrade!", {
          status: 402,
          statusText: "You expired your credits and need to upgrade!",
        });
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
