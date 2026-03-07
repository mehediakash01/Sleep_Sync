"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { BsClock } from "react-icons/bs";
import { useState } from "react";
import AiTipsSection from "../sleepImprove/AiTipsSection";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, SmilePlus, ListChecks, StickyNote } from "lucide-react";

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

const STEPS = [
  { label: "Session Time",       icon: Clock,       color: "text-[#89CFF0]",  bg: "bg-[#89CFF0]/15" },
  { label: "How You Felt",       icon: SmilePlus,   color: "text-[#B19CD9]",  bg: "bg-[#B19CD9]/15" },
  { label: "Before-Bed Factors", icon: ListChecks,  color: "text-emerald-500", bg: "bg-emerald-50"   },
  { label: "Notes & Submit",     icon: StickyNote,  color: "text-amber-500",  bg: "bg-amber-50"     },
];

const MOODS = [
  { value: "ðŸ˜´ Tired",    emoji: "ðŸ˜´", label: "Tired"    },
  { value: "ðŸ™‚ Okay",     emoji: "ðŸ™‚", label: "Okay"     },
  { value: "ðŸ˜Š Refreshed",emoji: "ðŸ˜Š", label: "Refreshed"},
  { value: "ðŸ˜« Restless", emoji: "ðŸ˜«", label: "Restless" },
  { value: "ðŸ˜¡ Irritable",emoji: "ðŸ˜¡", label: "Irritable"},
];

const FACTORS: { key: keyof SleepFormData; label: string; emoji: string }[] = [
  { key: "caffeineIntake",  label: "Caffeine Intake",   emoji: "â˜•" },
  { key: "alcoholIntake",   label: "Alcohol Intake",    emoji: "ðŸ·" },
  { key: "workout",         label: "Workout",            emoji: "ðŸƒ" },
  { key: "heavyMeal",       label: "Heavy Meal",        emoji: "ðŸ”" },
  { key: "lateScreenTime",  label: "Late Screen Time",  emoji: "ðŸ“±" },
  { key: "stressfulDay",    label: "Stressful Day",     emoji: "ðŸ˜¤" },
];

const QUALITY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Very Poor",  color: "text-red-500"    },
  2: { label: "Poor",       color: "text-orange-500" },
  3: { label: "Average",    color: "text-yellow-500" },
  4: { label: "Good",       color: "text-[#89CFF0]"  },
  5: { label: "Excellent",  color: "text-emerald-500"},
};

const slideVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export const SleepTrackForm = () => {
  const { data: session } = useSession();
  const email = session?.user?.email || "";
  const [sleepQuality, setSleepQuality] = useState(3);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, watch, reset } = useForm<SleepFormData>();

  const mood = watch("mood");

  const goTo = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const onSubmit = async (data: SleepFormData) => {
    try {
      const date = data.dateOfSession;
      const timeInBed = new Date(`${date}T${data.timeInBed}`);
      const wakeUpTime = new Date(`${date}T${data.wakeUpTime}`);
      const duration = (wakeUpTime.getTime() - timeInBed.getTime()) / (1000 * 60 * 60);

      await axios.post("/api/sleep", { ...data, sleepQuality, timeInBed, wakeUpTime, duration });
      toast.success("Sleep session logged!");
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to log sleep session");
    }
  };

  /* â”€â”€ Success screen â”€â”€ */
  if (submitted) {
    return (
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-xl p-10 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Logged!</h2>
        <p className="text-gray-500 mb-6">Your sleep data has been saved. Keep up the streak!</p>
        <button
          onClick={() => { setSubmitted(false); setStep(0); }}
          className="btn bg-gradient-to-r from-primary to-secondary text-white rounded-full px-8 border-0"
        >
          Log Another Session
        </button>
        <AiTipsSection email={email} />
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

      {/* â”€â”€ Progress header â”€â”€ */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        {/* Step chips */}
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone   = i < step;
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <button
                  type="button"
                  onClick={() => i < step && goTo(i)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300
                    ${isDone  ? "bg-emerald-100 cursor-pointer" : ""}
                    ${isActive ? `${s.bg} ring-2 ring-offset-2 ring-[#89CFF0]` : ""}
                    ${!isDone && !isActive ? "bg-gray-100 cursor-default" : ""}
                  `}
                >
                  {isDone
                    ? <CheckCircle2 size={18} className="text-emerald-500" />
                    : <Icon size={16} className={isActive ? s.color : "text-gray-400"} />
                  }
                </button>
                <span className={`text-[10px] font-medium hidden sm:block transition-colors ${isActive ? "text-gray-800" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#89CFF0] to-[#B19CD9] rounded-full"
            animate={{ width: `${((step) / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-right">Step {step + 1} of {STEPS.length}</p>
      </div>

      {/* â”€â”€ Step content â”€â”€ */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative min-h-[320px] overflow-hidden px-6 py-6">
          <AnimatePresence custom={dir} mode="wait">
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: "easeInOut" }}
            >

              {/* Step 0 â€” Session Time */}
              {step === 0 && (
                <div>
                  <StepTitle icon={<BsClock className="text-[#89CFF0] text-xl" />} title="When did you sleep?" subtitle="Set the date and your sleep window." />
                  <div className="grid sm:grid-cols-3 gap-4 mt-5">
                    <InputField label="Date" type="date" reg={register("dateOfSession", { required: true })} />
                    <InputField label="Time in Bed" type="time" reg={register("timeInBed",      { required: true })} />
                    <InputField label="Wake-up Time" type="time" reg={register("wakeUpTime",     { required: true })} />
                  </div>
                </div>
              )}

              {/* Step 1 â€” How you felt */}
              {step === 1 && (
                <div>
                  <StepTitle icon={<SmilePlus size={20} className="text-[#B19CD9]" />} title="How did you feel?" subtitle="Your mood and sleep quality on waking." />

                  <p className="text-sm font-semibold text-gray-700 mt-5 mb-2">Mood on Waking</p>
                  <div className="flex flex-wrap gap-2">
                    {MOODS.map((m) => (
                      <label key={m.value} className={`cursor-pointer flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border-2 transition-all
                        ${mood === m.value ? "border-[#B19CD9] bg-[#B19CD9]/10 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}>
                        <input type="radio" value={m.value} {...register("mood")} className="hidden" />
                        <span className="text-2xl">{m.emoji}</span>
                        <span className="text-xs font-medium text-gray-700">{m.label}</span>
                      </label>
                    ))}
                  </div>

                  <p className="text-sm font-semibold text-gray-700 mt-5 mb-2">
                    Sleep Quality &nbsp;
                    <span className={`font-bold ${QUALITY_LABELS[sleepQuality].color}`}>
                      {sleepQuality}/5 â€” {QUALITY_LABELS[sleepQuality].label}
                    </span>
                  </p>
                  <input type="range" min="1" max="5" step="1" value={sleepQuality}
                    onChange={(e) => setSleepQuality(Number(e.target.value))}
                    className="range range-primary w-full" />
                  <div className="w-full flex justify-between text-[10px] text-gray-400 mt-1 px-1">
                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                  </div>
                </div>
              )}

              {/* Step 2 â€” Factors */}
              {step === 2 && (
                <div>
                  <StepTitle icon={<ListChecks size={20} className="text-emerald-500" />} title="Before-Bed Factors" subtitle="Check anything that applied before you went to sleep." />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                    {FACTORS.map(({ key, label, emoji }) => {
                      const val = watch(key as keyof SleepFormData);
                      return (
                        <label key={key} className={`cursor-pointer flex items-center gap-3 p-3 rounded-2xl border-2 transition-all
                          ${val ? "border-emerald-400 bg-emerald-50 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}>
                          <input type="checkbox" {...register(key)} className="hidden" />
                          <span className="text-xl">{emoji}</span>
                          <span className="text-sm font-medium text-gray-700">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3 â€” Notes + Submit */}
              {step === 3 && (
                <div>
                  <StepTitle icon={<StickyNote size={20} className="text-amber-500" />} title="Anything else?" subtitle="Optional notes â€” dreams, interruptions, or how you really felt." />
                  <textarea
                    {...register("notes")}
                    rows={5}
                    placeholder="e.g. Woke up twice, had a vivid dream, felt groggy for an hour..."
                    className="w-full mt-5 rounded-2xl border-2 border-gray-200 focus:border-[#89CFF0] outline-none p-4 text-sm text-gray-700 resize-none transition"
                  />
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* â”€â”€ Navigation footer â”€â”€ */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/60">
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            disabled={step === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${step === 0 ? "opacity-0 pointer-events-none" : "text-gray-600 hover:bg-gray-200"}`}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => goTo(step + 1)}
              className="flex items-center gap-1.5 px-6 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#89CFF0] to-[#B19CD9] shadow-sm hover:shadow-md transition-all"
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#89CFF0] to-[#B19CD9] shadow-sm hover:shadow-md transition-all"
            >
              <CheckCircle2 size={16} /> Submit Session
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

/* â”€â”€ Small helpers â”€â”€ */
function StepTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <h2 className="text-lg font-bold text-gray-800 leading-tight">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

function InputField({ label, type, reg }: { label: string; type: string; reg: object }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <input
        type={type}
        {...reg}
        className="w-full rounded-xl border-2 border-gray-200 focus:border-[#89CFF0] outline-none px-3 py-2 text-sm text-gray-800 transition"
      />
    </div>
  );
}

