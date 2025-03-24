// DAILY LOG FORM
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/components/dailyLogForm.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns"; // <--- parseISO imported here
import { useUser } from "@/hooks/useUser";

// Define the structure for our form data
interface DailyLogFormData {
  mood: number;
  sleep: number;
  exercise: boolean;
  exerciseMinutes: number;
  meditation: boolean;
  meditationMinutes: number;
  waterIntake: number;
  highlights: string;
  challenges: string;
  gratitude: string;
  goals: string;
}

interface DailyLogFormProps {
  onClose: () => void;
  date?: string; // If not provided, use today's date.
}

export default function DailyLogForm({ onClose, date }: DailyLogFormProps) {
  const scoreDailyLogAction = useAction(api.score.scoreDailyLog);
  // 1) Determine the date for this form
  // If `date` was passed in, use that. Otherwise use today's date.
  const effectiveDate = date ?? new Date().toISOString().split("T")[0];

  // 2) Get the current user
  const { user, isSignedIn } = useUser();

  // 3) Fetch existing daily log, if any, for (userId, effectiveDate).
  const existingLog = useQuery(api.dailyLogs.getDailyLog, {
    userId: user ? user._id : "",
    date: effectiveDate,
  });

  // 4) Prepare the upsert mutation
  const dailyLogMutation = useMutation(api.dailyLogs.dailyLog);
  // The action that calls OpenAI and inserts into `feed` table
  const generateFeedForDailyLog = useAction(api.feed.generateFeedForDailyLog);

  // 5) Submission/error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 6) Setup React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<DailyLogFormData>({
    defaultValues: {
      mood: 5,
      sleep: 7,
      exercise: false,
      exerciseMinutes: 0,
      meditation: false,
      meditationMinutes: 0,
      waterIntake: 4,
      highlights: "",
      challenges: "",
      gratitude: "",
      goals: "",
    },
  });

  // 7) If there's an existing log, pre-fill the form
  useEffect(() => {
    if (existingLog) {
      reset({
        mood: existingLog.answers?.mood ?? 5,
        sleep: existingLog.answers?.sleep ?? 7,
        exercise: existingLog.answers?.exercise ?? false,
        exerciseMinutes: existingLog.answers?.exerciseMinutes ?? 0,
        meditation: existingLog.answers?.meditation ?? false,
        meditationMinutes: existingLog.answers?.meditationMinutes ?? 0,
        waterIntake: existingLog.answers?.waterIntake ?? 4,
        highlights: existingLog.answers?.highlights ?? "",
        challenges: existingLog.answers?.challenges ?? "",
        gratitude: existingLog.answers?.gratitude ?? "",
        goals: existingLog.answers?.goals ?? "",
      });
    }
  }, [existingLog, reset]);

  // 8) Conditionally show exercise/meditation fields
  const didExercise = watch("exercise");
  const didMeditate = watch("meditation");

  // 9) Submit handler (create or update daily log)
  const onSubmit = async (data: DailyLogFormData) => {
    if (!isSignedIn) {
      setError("You must be logged in to submit a log");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      await dailyLogMutation({
        userId: user._id,
        date: effectiveDate,
        answers: { ...data },
        score: undefined,
      });

      await scoreDailyLogAction({
        userId: user._id,         // Must match what your logs table uses
        date: effectiveDate,      // The same date you just saved
        });

        await generateFeedForDailyLog({
          userId: user._id.toString(),
          date: effectiveDate,
          });

      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save your daily log");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 10) Format the date properly without time zone shifting
  const parsedDate = parseISO(effectiveDate);
  // parseISO("2025-01-02") → a Date object for local Jan 2
  const formattedDisplayDate = format(parsedDate, "MMMM d, yyyy");

  return (
    <div className="flex flex-col space-y-4 text-zinc-50">
      <div>
        <h2 className="text-lg font-semibold">
          {existingLog ? "Edit Log" : "Log"} for {formattedDisplayDate}
        </h2>
        <p className="text-sm text-zinc-400">
          Fill in the details below to log your day. Your responses will be used
          to calculate your daily score.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Mood Tracker */}
        <div className="space-y-2">
          <Label htmlFor="mood" className="text-zinc-50">
            Rate your mood (1-10)
          </Label>
          <div className="flex items-center space-x-2">
            <span className="text-zinc-50">1</span>
            <Input
              id="mood"
              type="range"
              min="1"
              max="10"
              step="1"
              className="flex-1"
              {...register("mood", { required: true })}
            />
            <span className="text-zinc-50">10</span>
            <span className="w-8 text-center">{watch("mood")}</span>
          </div>
        </div>

        {/* Sleep */}
        <div className="space-y-2">
          <Label htmlFor="sleep" className="text-zinc-50">
            Hours of Sleep
          </Label>
          <Input
            id="sleep"
            type="number"
            className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-400"
            placeholder="7"
            {...register("sleep", { required: true, min: 0, max: 24 })}
          />
          {errors.sleep && (
            <p className="text-xs text-red-500">
              Please enter a valid number of hours (0-24)
            </p>
          )}
        </div>

        {/* Exercise */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              id="exercise"
              type="checkbox"
              className="rounded bg-zinc-800 border-zinc-700"
              {...register("exercise")}
            />
            <Label htmlFor="exercise" className="text-zinc-50">
              Did you exercise today?
            </Label>
          </div>
          {didExercise && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="exerciseMinutes" className="text-zinc-50">
                For how many minutes?
              </Label>
              <Input
                id="exerciseMinutes"
                type="number"
                className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-400"
                placeholder="0"
                {...register("exerciseMinutes", { required: didExercise, min: 1 })}
              />
              {errors.exerciseMinutes && (
                <p className="text-xs text-red-500">Please enter a valid duration</p>
              )}
            </div>
          )}
        </div>

        {/* Meditation */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              id="meditation"
              type="checkbox"
              className="rounded bg-zinc-800 border-zinc-700"
              {...register("meditation")}
            />
            <Label htmlFor="meditation" className="text-zinc-50">
              Did you meditate today?
            </Label>
          </div>
          {didMeditate && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="meditationMinutes" className="text-zinc-50">
                For how many minutes?
              </Label>
              <Input
                id="meditationMinutes"
                type="number"
                className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-400"
                placeholder="0"
                {...register("meditationMinutes", { required: didMeditate, min: 1 })}
              />
              {errors.meditationMinutes && (
                <p className="text-xs text-red-500">Please enter a valid duration</p>
              )}
            </div>
          )}
        </div>

        {/* Water Intake */}
        <div className="space-y-2">
          <Label htmlFor="waterIntake" className="text-zinc-50">
            Glasses of water
          </Label>
          <Input
            id="waterIntake"
            type="number"
            className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-400"
            placeholder="4"
            {...register("waterIntake", { required: true, min: 0 })}
          />
        </div>

        {/* Highlights */}
        <div className="space-y-2">
          <Label htmlFor="highlights" className="text-zinc-50">
            Highlights of your day
          </Label>
          <Textarea
            id="highlights"
            className="bg-zinc-800 border-zinc-700 min-h-[80px] placeholder:text-zinc-400"
            placeholder="The best moments of my day were..."
            {...register("highlights")}
          />
        </div>

        {/* Challenges */}
        <div className="space-y-2">
          <Label htmlFor="challenges" className="text-zinc-50">
            Challenges you faced
          </Label>
          <Textarea
            id="challenges"
            className="bg-zinc-800 border-zinc-700 min-h-[80px] placeholder:text-zinc-400"
            placeholder="I struggled with..."
            {...register("challenges")}
          />
        </div>

        {/* Gratitude */}
        <div className="space-y-2">
          <Label htmlFor="gratitude" className="text-zinc-50">
            What are you grateful for?
          </Label>
          <Textarea
            id="gratitude"
            className="bg-zinc-800 border-zinc-700 min-h-[80px] placeholder:text-zinc-400"
            placeholder="I'm grateful for..."
            {...register("gratitude")}
          />
        </div>

        {/* Goals */}
        <div className="space-y-2">
          <Label htmlFor="goals" className="text-zinc-50">
            Goals for tomorrow
          </Label>
          <Textarea
            id="goals"
            className="bg-zinc-800 border-zinc-700 min-h-[80px] placeholder:text-zinc-400"
            placeholder="Tomorrow I will..."
            {...register("goals")}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-500 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Daily Log"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}