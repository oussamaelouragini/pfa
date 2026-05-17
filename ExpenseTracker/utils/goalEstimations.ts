interface GoalEstimationInput {
  savedAmount: number;
  target: number;
  createdAt: string;
  duration: string;
  frequency: string;
  formatCurrency: (n: number) => string;
}

export interface GoalInsight {
  completionPercent: number;
  estimatedMonthsRemaining: number | null;
  monthlySavingRate: number;
  message: string;
  type: "on_track" | "ahead" | "delayed" | "just_started" | "completed";
}

function parseDurationMonths(duration: string): number {
  const num = parseFloat(duration);
  if (duration.includes("year")) return num * 12;
  if (duration.includes("month")) return num;
  if (duration.includes("week")) return Math.round(num / 4.33);
  if (duration.includes("day")) return Math.round(num / 30);
  return num || 12;
}

function parseFrequencyMonthly(frequency: string): number {
  const f = frequency.toLowerCase();
  if (f.includes("weekly")) return 4.33;
  if (f.includes("bi") || f.includes("bi-weekly") || f.includes("biweekly")) return 2.17;
  if (f.includes("monthly")) return 1;
  if (f.includes("quarterly")) return 1 / 3;
  if (f.includes("yearly") || f.includes("annual")) return 1 / 12;
  return 1;
}

function formatDuration(duration: string): string {
  const num = parseFloat(duration);
  if (duration.includes("year")) return `${num} ${num === 1 ? "year" : "years"}`;
  if (duration.includes("month")) return `${num} ${num === 1 ? "month" : "months"}`;
  if (duration.includes("week")) return `${num} ${num === 1 ? "week" : "weeks"}`;
  if (duration.includes("day")) return `${num} ${num === 1 ? "day" : "days"}`;
  return duration;
}

function formatFrequency(frequency: string): string {
  const f = frequency.toLowerCase();
  if (f.includes("weekly")) return "weekly";
  if (f.includes("bi-weekly") || f.includes("biweekly")) return "bi-weekly";
  if (f.includes("monthly")) return "monthly";
  if (f.includes("quarterly")) return "quarterly";
  if (f.includes("yearly") || f.includes("annual")) return "yearly";
  return f;
}

export function calculateGoalInsights(input: GoalEstimationInput): GoalInsight {
  const { savedAmount, target, createdAt, duration, frequency, formatCurrency } = input;

  const saved = Math.max(0, savedAmount);
  const targetVal = Math.max(1, target);
  const completionPercent = Math.min(Math.round((saved / targetVal) * 100), 100);

  if (completionPercent >= 100) {
    return {
      completionPercent: 100,
      estimatedMonthsRemaining: 0,
      monthlySavingRate: 0,
      message: `Goal of ${formatCurrency(targetVal)} achieved! Well done.`,
      type: "completed",
    };
  }

  const createdAtDate = new Date(createdAt);
  const now = new Date();
  const elapsedMonths = Math.max(0.1, (now.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));

  const monthlySavingRate = saved / elapsedMonths;
  const totalMonths = parseDurationMonths(duration);
  const freqMonthly = parseFrequencyMonthly(frequency);
  const expectedSavingRate = totalMonths > 0 && freqMonthly > 0
    ? targetVal / (totalMonths * freqMonthly)
    : targetVal / (totalMonths * 1);

  const remaining = targetVal - saved;
  const estimatedMonthsRemaining = monthlySavingRate > 0
    ? Math.ceil(remaining / monthlySavingRate)
    : null;

  const freqLabel = formatFrequency(frequency);
  const durLabel = formatDuration(duration);
  const requiredAmount = Math.ceil(remaining / (totalMonths * freqMonthly));

  let message: string;
  let type: GoalInsight["type"] = "on_track";

  if (saved <= 0) {
    message = `To reach your goal of ${formatCurrency(targetVal)}, save ${formatCurrency(requiredAmount)} ${freqLabel} over ${durLabel}.`;
    type = "just_started";
  } else if (monthlySavingRate <= 0) {
    message = `To reach your goal of ${formatCurrency(targetVal)}, save ${formatCurrency(requiredAmount)} ${freqLabel} over ${durLabel}.`;
    type = "just_started";
  } else if (estimatedMonthsRemaining !== null) {
    if (estimatedMonthsRemaining <= 0) {
      message = `Goal of ${formatCurrency(targetVal)} achieved! Well done.`;
      type = "completed";
    } else if (monthlySavingRate >= expectedSavingRate * 1.2) {
      const estMonths = estimatedMonthsRemaining <= 12
        ? `${estimatedMonthsRemaining} months`
        : `${Math.round(estimatedMonthsRemaining / 12)} years`;
      message = `On track to finish in ${estMonths} — saving ${formatCurrency(Math.round(monthlySavingRate))} ${freqLabel}.`;
      type = "ahead";
    } else if (monthlySavingRate >= expectedSavingRate * 0.5) {
      const estMonths = estimatedMonthsRemaining <= 12
        ? `${estimatedMonthsRemaining} months`
        : `${Math.round(estimatedMonthsRemaining / 12)} years`;
      message = `To reach your goal of ${formatCurrency(targetVal)}, save ${formatCurrency(requiredAmount)} ${freqLabel} over ${durLabel}.`;
      type = "on_track";
    } else {
      message = `Increase your savings to ${formatCurrency(requiredAmount)} ${freqLabel} to reach ${formatCurrency(targetVal)} on time.`;
      type = "delayed";
    }
  } else {
    message = `To reach your goal of ${formatCurrency(targetVal)}, save ${formatCurrency(requiredAmount)} ${freqLabel} over ${durLabel}.`;
    type = "just_started";
  }

  return {
    completionPercent,
    estimatedMonthsRemaining,
    monthlySavingRate: Math.round(monthlySavingRate * 100) / 100,
    message,
    type,
  };
}
