// DAILY LOG FORM
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/components/dailyLogForm.tsx

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useUser } from "@/hooks/useUser";

// Define the structure for our form data.
interface DailyLogFormData {
  mood: number; // 1-10
  sleep: number; // Hours
  exercise: boolean;
  exerciseMinutes: number;
  meditation: boolean;
  meditationMinutes: number;
  waterIntake: number; // Glasses
  highlights: string;
  challenges: string;
  gratitude: string;
  goals: string;
}

interface DailyLogFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const DailyLogForm: React.FC<DailyLogFormProps> = ({ isOpen, onClose }) => {
  // Use Convex auth hook.
  const { user } = useUser();
  const dailyLogMutation = useMutation(api.dailyLogs.dailyLog);
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

  // Watch exercise and meditation to conditionally show duration fields.
  const didExercise = watch("exercise");
  const didMeditate = watch("meditation");

  // Get today's date formatted as YYYY-MM-DD.
  const today = format(new Date(), "yyyy-MM-dd");

  const onSubmit = async (data: DailyLogFormData) => {
    if (!user) {
      setError("You must be logged in to submit a log");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Call the Convex mutation with the form data.
      await dailyLogMutation({
        userId: user.userId,
        date: today,
        answers: { ...data },
        score: undefined, // Let your backend or AI compute the score later.
      });
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save your daily log");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 text-zinc-100 border-zinc-800">
        <DialogHeader>
          <DialogTitle>Daily Log for {format(new Date(), "MMMM d, yyyy")}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Answer the questions below to log your day. Your responses will be used to calculate your daily score.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Mood Tracker */}
          <div className="space-y-2">
            <Label htmlFor="mood">How would you rate your mood today? (1-10)</Label>
            <div className="flex items-center space-x-2">
              <span className="text-zinc-400">1</span>
              <Input
                id="mood"
                type="range"
                min="1"
                max="10"
                step="1"
                className="flex-1"
                {...register("mood", { required: true, min: 1, max: 10 })}
              />
              <span className="text-zinc-400">10</span>
              <span className="w-8 text-center">{watch("mood")}</span>
            </div>
          </div>

          {/* Sleep */}
          <div className="space-y-2">
            <Label htmlFor="sleep">How many hours did you sleep last night?</Label>
            <Input
              id="sleep"
              type="number"
              className="bg-zinc-800 border-zinc-700"
              {...register("sleep", { required: true, min: 0, max: 24 })}
            />
            {errors.sleep && (
              <p className="text-xs text-red-500">Please enter a valid number of hours (0-24)</p>
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
              <Label htmlFor="exercise">Did you exercise today?</Label>
            </div>
            {didExercise && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="exerciseMinutes">For how many minutes?</Label>
                <Input
                  id="exerciseMinutes"
                  type="number"
                  className="bg-zinc-800 border-zinc-700"
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
              <Label htmlFor="meditation">Did you meditate today?</Label>
            </div>
            {didMeditate && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="meditationMinutes">For how many minutes?</Label>
                <Input
                  id="meditationMinutes"
                  type="number"
                  className="bg-zinc-800 border-zinc-700"
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
            <Label htmlFor="waterIntake">How many glasses of water did you drink today?</Label>
            <Input
              id="waterIntake"
              type="number"
              className="bg-zinc-800 border-zinc-700"
              {...register("waterIntake", { required: true, min: 0 })}
            />
            {errors.waterIntake && (
              <p className="text-xs text-red-500">Please enter a valid number</p>
            )}
          </div>

          {/* Highlights */}
          <div className="space-y-2">
            <Label htmlFor="highlights">What were the highlights of your day?</Label>
            <Textarea
              id="highlights"
              className="bg-zinc-800 border-zinc-700 min-h-[80px]"
              placeholder="The best moments of my day were..."
              {...register("highlights")}
            />
          </div>

          {/* Challenges */}
          <div className="space-y-2">
            <Label htmlFor="challenges">What challenges did you face today?</Label>
            <Textarea
              id="challenges"
              className="bg-zinc-800 border-zinc-700 min-h-[80px]"
              placeholder="I struggled with..."
              {...register("challenges")}
            />
          </div>

          {/* Gratitude */}
          <div className="space-y-2">
            <Label htmlFor="gratitude">What are you grateful for today?</Label>
            <Textarea
              id="gratitude"
              className="bg-zinc-800 border-zinc-700 min-h-[80px]"
              placeholder="I'm grateful for..."
              {...register("gratitude")}
            />
          </div>

          {/* Goals */}
          <div className="space-y-2">
            <Label htmlFor="goals">What are your goals for tomorrow?</Label>
            <Textarea
              id="goals"
              className="bg-zinc-800 border-zinc-700 min-h-[80px]"
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Daily Log"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DailyLogForm;