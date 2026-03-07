import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (not your regular password)
  },
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendMailOptions) {
  try {
    await transporter.sendMail({
      from: `"SleepSync" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    // Email sending should never crash the main request
    console.error("[Email] Failed to send email:", error);
  }
}

// ──────────────────────────────────────────
// Email Templates
// ──────────────────────────────────────────

export function sleepLoggedTemplate(name: string, duration: number, quality: number) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#f8fafc;border-radius:12px;">
      <h2 style="color:#6366f1;margin-bottom:8px;">💤 Sleep Log Recorded</h2>
      <p style="color:#374151;">Hi <strong>${name}</strong>,</p>
      <p style="color:#374151;">Your sleep session has been successfully logged.</p>
      <div style="background:#fff;border-radius:8px;padding:20px;margin:20px 0;border:1px solid #e5e7eb;">
        <p style="margin:4px 0;color:#374151;"><strong>Duration:</strong> ${duration.toFixed(1)} hours</p>
        <p style="margin:4px 0;color:#374151;"><strong>Quality:</strong> ${quality}/5</p>
      </div>
      <p style="color:#6b7280;font-size:13px;">Keep tracking to improve your sleep health. — SleepSync</p>
    </div>`;
}

export function streakTemplate(name: string, days: number) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#f8fafc;border-radius:12px;">
      <h2 style="color:#f59e0b;margin-bottom:8px;">🔥 ${days}-Day Sleep Streak!</h2>
      <p style="color:#374151;">Hi <strong>${name}</strong>,</p>
      <p style="color:#374151;">Amazing work! You've logged your sleep for <strong>${days} days in a row</strong>.</p>
      <p style="color:#374151;">Consistency is the key to better sleep health. Keep it up!</p>
      <p style="color:#6b7280;font-size:13px;">— SleepSync</p>
    </div>`;
}

export function poorSleepTemplate(name: string, quality: number) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#f8fafc;border-radius:12px;">
      <h2 style="color:#ef4444;margin-bottom:8px;">😴 Poor Sleep Detected</h2>
      <p style="color:#374151;">Hi <strong>${name}</strong>,</p>
      <p style="color:#374151;">We noticed you logged a low sleep quality score of <strong>${quality}/5</strong> today.</p>
      <p style="color:#374151;">Check your AI Sleep Coach for personalized tips to improve your rest.</p>
      <p style="color:#6b7280;font-size:13px;">— SleepSync</p>
    </div>`;
}

export function bedtimeReminderTemplate(name: string) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#f8fafc;border-radius:12px;">
      <h2 style="color:#8b5cf6;margin-bottom:8px;">🌙 Bedtime Reminder</h2>
      <p style="color:#374151;">Hi <strong>${name}</strong>,</p>
      <p style="color:#374151;">It's almost your set bedtime! Start winding down for a good night's rest.</p>
      <p style="color:#374151;">Put your screen away and relax — your body will thank you tomorrow.</p>
      <p style="color:#6b7280;font-size:13px;">— SleepSync</p>
    </div>`;
}
