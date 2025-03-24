// FEED
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/convex/feed.ts

import { query, action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Id, Doc } from "./_generated/dataModel";

/**
 * The shape of data returned by the LLM's chat completion API.
 * We define a minimal type for TypeScript.
 */
interface OpenAIChatCompletion {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

/**
 * 1) listFeedMessages query:
 *    Fetch all feed messages for a given user.
 *    (Optionally, you could also filter by date or do ordering here.)
 */
export const listFeedMessages = query({
  args: {
    userId: v.string(), // Must match the string stored in `feed.userId`
  },
  // Return type is an array of feed docs
  handler: async ({ db }, { userId }): Promise<Doc<"feed">[]> => {
    // We assume your `feed` table has fields: userId, date, message, createdAt
    return await db
      .query("feed")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc") // or "asc", whichever you prefer
      .collect();
  },
});

/**
 * 2) generateFeedForDailyLog action:
 *    - Calls getDailyLog to fetch the user's daily log
 *    - Calls OpenAI to get a short summary or encouragement text
 *    - Inserts that text into the "feed" table
 *
 *    Returns { reply: string }
 */
export const generateFeedForDailyLog = action({
  args: {
    userId: v.string(), // The doc ID or authId for logs
    date: v.string(),   // "YYYY-MM-DD"
  },
  handler: async (ctx, { userId, date }): Promise<{ reply: string }> => {
    // 1) Fetch the daily log from DB by calling your dailyLogs.getDailyLog query
    const dailyLog = await ctx.runQuery(api.dailyLogs.getDailyLog, {
      userId,
      date,
    });
    if (!dailyLog) {
      throw new Error(`No daily log found for userId=${userId}, date=${date}`);
    }

    // 2) Build prompts for the LLM
    const systemPrompt = `
      You are an encouraging assistant that comments on a user's day.
      Based on the provided JSON of the user's daily log, respond with 
      a brief friendly message about how their day went and some suggestions for tomorrow.
      Keep it to 2-3 sentences maximum.
    `.trim();

    // Convert dailyLog.answers to JSON for the LLM
    const userContent = JSON.stringify(dailyLog.answers, null, 2);

    // 3) Make sure your OpenAI key is available
    const openAiApiKey = process.env.OPENAI_API_KEY;
    if (!openAiApiKey) {
      throw new Error("Missing OPENAI_API_KEY in environment!");
    }

    // 4) Call OpenAI's Chat Completion
    const body = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Here is the user's daily log in JSON:\n${userContent}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    };

    const response: Response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenAI error: ${text}`);
    }

    const completion: OpenAIChatCompletion = await response.json();
    const assistantReply: string =
      completion.choices?.[0]?.message?.content?.trim() || "(No response)";

    // 5) Store the LLM response in the "feed" table
    await ctx.runMutation(api.feed.storeFeedMessage, {
      userId,
      date,
      message: assistantReply,
    });

    return { reply: assistantReply };
  },
});

/**
 * 3) storeFeedMessage mutation:
 *    Saves a single feed "message" in your "feed" table.
 */
export const storeFeedMessage = mutation({
  args: {
    userId: v.string(),
    date: v.string(),
    message: v.string(),
  },
  handler: async ({ db }, { userId, date, message }) => {
    // Insert into "feed" table (defined in your schema)
    return db.insert("feed", {
      userId,
      date,
      message,
      createdAt: Date.now(),
    });
  },
});