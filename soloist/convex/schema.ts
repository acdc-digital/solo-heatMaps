// SCHEMA
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    authId: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()), // <-- Add image here
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.float64()),
    isAnonymous: v.optional(v.boolean()),
    githubId: v.optional(v.number()), // if you're storing this as well
  }).index("email", ["email"]),

  logs: defineTable({
    // The user who created the log
    userId: v.string(),
    // A unique date identifier for the daily log (could be formatted as YYYY-MM-DD)
    date: v.string(),
    // Store answers as an object.
    // You could be more specific if you have fixed questions.
    answers: v.any(),
    // A computed daily score, e.g. 0-100.
    score: v.optional(v.number()),
    // Timestamps to track log creation and updates.
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("userId", ["userId"]),

  feed: defineTable({
    userId: v.string(),
    date: v.string(),
    message: v.string(),
    createdAt: v.number(),
  }),
  
  // other tables...
});

export default schema;