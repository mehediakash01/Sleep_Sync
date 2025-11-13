"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { BsClock } from "react-icons/bs";
import { useState } from "react";
import AiTipsSection from "../sleepImprove/AiTipsSection";
import { useSession } from "next-auth/react";

type SleepFormData = {
  dateOfSession: string;
  timeInBed: string;
  wakeUpTime: string;
  sleepQuality: number;
  mood: string;
  caffeineIntake?: boolean;
  alcoholIntake?: boolean;
  workout?: boolean;
  heavyMeal?: boolean;
  lateScreenTime?: boolean;
  stressfulDay?: boolean;
  notes?: string;
};

export const SleepTrackForm = () => {
   const { data: session } = useSession();
  const email = session?.user?.email || "";
  const [sleepQuality, setSleepQuality] = useState(3);
  const { register, handleSubmit, reset } = useForm<SleepFormData>();

  const onSubmit = async (data: SleepFormData) => {
    try {
      // Combine date + time for timeInBed and wakeUpTime
      const date = data.dateOfSession;
      const timeInBed = new Date(`${date}T${data.timeInBed}`);
      const wakeUpTime = new Date(`${date}T${data.wakeUpTime}`);

      const duration =
        (wakeUpTime.getTime() - timeInBed.getTime()) / (1000 * 60 * 60);

      const payload = {
        ...data,
        sleepQuality,
        timeInBed,
        wakeUpTime,
        duration,
      };

      await axios.post("/api/sleep", payload);
      toast.success("Sleep session logged!");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to log sleep session");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="flex items-center justify-center gap-2 text-3xl font-bold mb-6">
        <BsClock className="text-primary text-2xl" />
        New Sleep Session
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date + Time Inputs */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Date of Session</label>
            <input
              type="date"
              {...register("dateOfSession", { required: true })}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Time in Bed</label>
            <input
              type="time"
              {...register("timeInBed", { required: true })}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Wake-up Time</label>
            <input
              type="time"
              {...register("wakeUpTime", { required: true })}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Mood */}
        <div>
          <label className="block mb-2 font-semibold text-lg">
            Mood on Waking
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              "😴 Tired",
              "🙂 Okay",
              "😊 Refreshed",
              "😫 Restless",
              "😡 Irritable",
            ].map((mood) => (
              <label
                key={mood}
                className="flex items-center gap-2 border px-3 py-2 rounded-lg cursor-pointer hover:bg-base-200 transition"
              >
                <input
                  type="radio"
                  value={mood}
                  {...register("mood")}
                  className="radio"
                />
                <span>{mood}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sleep Quality */}
        <div>
          <label className="block mb-2 font-semibold text-lg">
            Sleep Quality: <span className="text-primary">{sleepQuality}</span>
            /5
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={sleepQuality}
            onChange={(e) => setSleepQuality(Number(e.target.value))}
            className="range range-primary w-full"
          />
        </div>

        {/* Environmental Factors */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Environmental Factors (Before Bed)
          </h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {(
              [
                "caffeineIntake",
                "alcoholIntake",
                "workout",
                "heavyMeal",
                "lateScreenTime",
                "stressfulDay",
              ] as (keyof SleepFormData)[]
            ).map((factor) => (
              <label key={factor} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register(factor)}
                  className="checkbox checkbox-primary"
                />
                <span>
                  {factor
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block mb-2 font-semibold text-lg">
            Additional Notes
          </label>
          <textarea
            {...register("notes")}
            className="textarea textarea-bordered w-full h-24"
            placeholder="How did you sleep? Any dreams or interruptions?"
          />
        </div>

        <button type="submit"  className="btn w-full   bg-gradient-to-l from-secondary to-primary rounded-full">
          Log Sleep Session
        </button>
        <AiTipsSection email={email} />
    
      </form>
    </div>
  );
};
