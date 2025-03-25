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
import { format, parseISO } from "date-fns";
import { useUser } from "@/hooks/useUser";
import { Separator } from "@/components/ui/separator";

// Simplified form structure
interface DailyLogFormData {
  // Quick ratings (1-10 scales)
  overallMood: number;
  workSatisfaction: number;
  personalLifeSatisfaction: number;
  balanceRating: number;

  // Basic wellness
  sleep: number;
  exercise: boolean;

  // Key reflections
  highlights: string;
  challenges: string;
  tomorrowGoal: string;
}

interface DailyLogFormProps {
  onClose: () => void;
  date?: string;
}

export default function DailyLogForm({ onClose, date }: DailyLogFormProps) {
  const scoreDailyLogAction = useAction(api.score.scoreDailyLog);
  const effectiveDate = date ?? new Date().toISOString().split("T")[0];
  const { user, isSignedIn } = useUser();

  const existingLog = useQuery(api.dailyLogs.getDailyLog, {
    userId: user ? user._id : "",
    date: effectiveDate,
  });

  const dailyLogMutation = useMutation(api.dailyLogs.dailyLog);
  const generateFeedForDailyLog = useAction(api.feed.generateFeedForDailyLog);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<DailyLogFormData>({
    defaultValues: {
      overallMood: 5,
      workSatisfaction: 5,
      personalLifeSatisfaction: 5,
      balanceRating: 5,
      sleep: 7,
      exercise: false,
      highlights: "",
      challenges: "",
      tomorrowGoal: "",
    },
  });

  useEffect(() => {
    if (existingLog && existingLog.answers) {
      reset({
        overallMood: existingLog.answers.overallMood ?? 5,
        workSatisfaction: existingLog.answers.workSatisfaction ?? 5,
        personalLifeSatisfaction: existingLog.answers.personalLifeSatisfaction ?? 5,
        balanceRating: existingLog.answers.balanceRating ?? 5,
        sleep: existingLog.answers.sleep ?? 7,
        exercise: existingLog.answers.exercise ?? false,
        highlights: existingLog.answers.highlights ?? "",
        challenges: existingLog.answers.challenges ?? "",
        tomorrowGoal: existingLog.answers.tomorrowGoal ?? "",
      });
    }
  }, [existingLog, reset]);

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
        userId: user._id,
        date: effectiveDate,
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

  const parsedDate = parseISO(effectiveDate);
  const formattedDisplayDate = format(parsedDate, "MMMM d, yyyy");

  return (
    <div className="flex flex-col space-y-4 text-zinc-50">
      <div>
        <h2 className="text-lg font-semibold">
          {existingLog ? "Edit Log" : "Quick Log"} for {formattedDisplayDate}
        </h2>
        <p className="text-sm text-zinc-400">
          Track your work-life balance in just 60 seconds
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Quick Ratings Section */}
        <div className="space-y-4">
          <h3 className="font-medium text-zinc-300">Rate Your Day (1-10)</h3>
          
          {/* Overall Mood */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <Label htmlFor="overallMood" className="text-zinc-50">
                Overall Mood
              </Label>
              <span className="text-zinc-300">{watch("overallMood")}/10</span>
            </div>
            <Input
              id="overallMood"
              type="range"
              min="1"
              max="10"
              step="1"
              className="w-full"
              {...register("overallMood", { required: true })}
            />
          </div>
          
          {/* Work Satisfaction */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <Label htmlFor="workSatisfaction" className="text-zinc-50">
                Work Satisfaction
              </Label>
              <span className="text-zinc-300">{watch("workSatisfaction")}/10</span>
            </div>
            <Input
              id="workSatisfaction"
              type="range"
              min="1"
              max="10"
              step="1"
              className="w-full"
              {...register("workSatisfaction", { required: true })}
            />
          </div>
          
          {/* Personal Life Satisfaction */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <Label htmlFor="personalLifeSatisfaction" className="text-zinc-50">
                Personal Life Satisfaction
              </Label>
              <span className="text-zinc-300">{watch("personalLifeSatisfaction")}/10</span>
            </div>
            <Input
              id="personalLifeSatisfaction"
              type="range"
              min="1"
              max="10"
              step="1"
              className="w-full"
              {...register("personalLifeSatisfaction", { required: true })}
            />
          </div>
          
          {/* Work-Life Balance */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <Label htmlFor="balanceRating" className="text-zinc-50">
                Work-Life Balance
              </Label>
              <span className="text-zinc-300">{watch("balanceRating")}/10</span>
            </div>
            <Input
              id="balanceRating"
              type="range"
              min="1"
              max="10"
              step="1"
              className="w-full"
              {...register("balanceRating", { required: true })}
            />
          </div>
        </div>
        
        <Separator />
        
        {/* Basic Wellness */}
        <div className="space-y-4">
          <h3 className="font-medium text-zinc-300">Basic Wellness</h3>
          
          {/* Sleep */}
          <div className="flex items-center space-x-4">
            <Label htmlFor="sleep" className="text-zinc-50 w-32">
              Hours of sleep:
            </Label>
            <Input
              id="sleep"
              type="number"
              className="bg-zinc-800 border-zinc-700 w-20"
              placeholder="7"
              step="0.5"
              min="0"
              max="24"
              {...register("sleep", { required: true, min: 0, max: 24 })}
            />
          </div>
          
          {/* Exercise */}
          <div className="flex items-center space-x-2">
            <input
              id="exercise"
              type="checkbox"
              className="rounded bg-zinc-800 border-zinc-700"
              {...register("exercise")}
            />
            <Label htmlFor="exercise" className="text-zinc-50">
              Exercise today?
            </Label>
          </div>
        </div>
        
        <Separator />
        
        {/* Key Reflections */}
        <div className="space-y-4">
          <h3 className="font-medium text-zinc-300">Quick Reflections</h3>
          
          {/* Highlights */}
          <div className="space-y-2">
            <Label htmlFor="highlights" className="text-zinc-50">
              Today's highlight
            </Label>
            <Textarea
              id="highlights"
              className="bg-zinc-800 border-zinc-700 min-h-[60px] placeholder:text-zinc-400"
              placeholder="What was the best part of your day?"
              {...register("highlights")}
            />
          </div>
          
          {/* Challenges */}
          <div className="space-y-2">
            <Label htmlFor="challenges" className="text-zinc-50">
              Today's challenge
            </Label>
            <Textarea
              id="challenges"
              className="bg-zinc-800 border-zinc-700 min-h-[60px] placeholder:text-zinc-400"
              placeholder="What was challenging today?"
              {...register("challenges")}
            />
          </div>
          
          {/* Tomorrow's Goal */}
          <div className="space-y-2">
            <Label htmlFor="tomorrowGoal" className="text-zinc-50">
              Tomorrow's focus
            </Label>
            <Textarea
              id="tomorrowGoal"
              className="bg-zinc-800 border-zinc-700 min-h-[60px] placeholder:text-zinc-400"
              placeholder="What's your main focus for tomorrow?"
              {...register("tomorrowGoal")}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-500 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Actions */}
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
              "Save Log"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}