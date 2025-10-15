"use client";

import React, { useState } from "react";
import { BsClock } from "react-icons/bs";

export const SleepTrackForm = () => {
     const [sleepQuality, setSleepQuality] = useState(1);
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <h1 className="flex items-center justify-center gap-2 text-3xl font-bold mb-6">
        <BsClock className="text-primary text-2xl" />
        New Sleep Session
      </h1>

      <form className="space-y-6">
        {/* Date + Time Inputs */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Date of Session</label>
            <input type="date" className="input input-bordered w-full" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">Time in Bed</label>
            <input type="time" className="input input-bordered w-full" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">Wake-up Time</label>
            <input type="time" className="input input-bordered w-full" required />
          </div>
        </div>

        {/* Mood Selector */}
        <div>
          <label className="block mb-2 font-semibold text-lg">Mood on Waking</label>
          <div className="flex flex-wrap gap-3">
            {["😴 Tired", "🙂 Okay", "😊 Refreshed", "😫 Restless", "😡 Irritable"].map(
              (mood) => (
                <label
                  key={mood}
                  className="flex items-center gap-2 border px-3 py-2 rounded-lg cursor-pointer hover:bg-base-200 transition"
                >
                  <input type="radio" name="mood" className="radio" required />
                  <span>{mood}</span>
                </label>
              )
            )}
          </div>
        </div>

   {/* Sleep Quality Slider */}
        <div>
          <label className="block mb-2 font-semibold text-lg">
            Sleep Quality:{" "}
            <span className="text-primary">{sleepQuality}</span>/5
          </label>

          <div className="relative w-full">
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={sleepQuality}
              onChange={(e) => setSleepQuality(Number(e.target.value))}
              className="range range-primary w-full"
            />

            {/* Step labels aligned evenly under the slider */}
            <div className="grid grid-cols-5 text-xs text-center mt-2">
              <span className={sleepQuality === 1 ? "font-bold text-primary" : ""}>1</span>
              <span className={sleepQuality === 2 ? "font-bold text-primary" : ""}>2</span>
              <span className={sleepQuality === 3 ? "font-bold text-primary" : ""}>3</span>
              <span className={sleepQuality === 4 ? "font-bold text-primary" : ""}>4</span>
              <span className={sleepQuality === 5 ? "font-bold text-primary" : ""}>5</span>
            </div>

            {/* Quality labels */}
            <div className="grid grid-cols-5 text-[11px] text-gray-500 mt-1 text-center">
              <span>Poor</span>
              <span>Fair</span>
              <span>Average</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>


        {/* Environmental Factors */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Environmental Factors (Before Bed)
          </h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {[
              "Caffeine Intake",
              "Alcohol Intake",
              "Workout",
              "Heavy Meal",
              "Late Screen Time",
              "Stressful Day",
            ].map((factor) => (
              <label key={factor} className="flex items-center gap-2">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span>{factor}</span>
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
            className="textarea textarea-bordered w-full h-24"
            placeholder="How did you sleep? Any dreams, interruptions, or observations?"
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">Optional</p>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-full text-lg">
          Log Sleep Session
        </button>
      </form>
    </div>
  );
};
