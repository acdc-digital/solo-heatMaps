// DAILY LOGS
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/convex/dailyLogs.ts

import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const dailyLog = mutation({
  args: {
    userId: v.string(),
    date: v.string(),
    answers: v.object({}),
    score: v.optional(v.number()),
  },
  handler: async ({ db }, { userId, date, answers, score }) => {
    // Try to find an existing log for this user and date.
    const existingLog = await db.query("logs")
      .filter(q => q.eq(q.field("userId"), userId))
      .filter(q => q.eq(q.field("date"), date))
      .first();

    if (existingLog) {
      await db.patch(existingLog._id, {
        answers,
        score,
        updatedAt: Date.now(),
      });
      return db.get(existingLog._id);
    } else {
      return db.insert("logs", {
        userId,
        date,
        answers,
        score,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});