# AI.md - Google Gemini API Integration Guide

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
4. [Implementation](#implementation)
5. [Flow Diagram](#flow-diagram)
6. [Files Reference](#files-reference)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This document explains how to integrate Google Gemini API into the ExpenseTracker app for AI-powered savings goal predictions.

### Current State (Mock AI)

The app currently has a fake AI feature in `CreateGoalScreen.tsx`:

```typescript
// Current mock calculation (simple division, not AI)
const estimatedDeposit =
  amount > 0 ? Math.round(amount / (months * depositsPerMonth)) : 0;
```

This is just basic math - no AI, no ML, no predictions.

### What Real AI Will Do

| Current (Mock)       | Real AI (Gemini)                 |
| -------------------- | -------------------------------- |
| Simple division      | Analyze user financial data      |
| Fixed formula        | Predict optimal deposit          |
| Generic output       | Personalized recommendations     |
| No context awareness | Considers balance, goals, income |

---

## Prerequisites

### Step 1: Get Your Gemini API Key

1. Go to: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (it starts with `AIzaSy...`)

### Step 2: Install Dependencies

```bash
npm install @google/generative-ai
```

### Step 3: Set Up Environment Variable

Create a file called `.env` in your project root:

```
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Add this line to your `.gitignore` file:

```
.env
```

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ExpenseTracker App                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────┐         ┌──────────────────────┐              │
│  │  CreateGoal     │         │  GoalsScreen    │              │
│  │  Screen.tsx   │         │  (AI Card)    │              │
│  └───────┬──────────┘         └───────┬──────────┘              │
│          │                            │                           │
│          ▼                            ▼                           │
│  ┌────────────────────────────────────────────────────────┐              │
│  │       useGoalPrediction.ts (Hook)                    │              │
│  │  • Manages loading state                            │              │
│  │  • Calls geminiService                         │              │
│  │  • Returns prediction to UI                      │              │
│  └───────────────────────┬────────────────────────┘              │
│                          │                                          │
│                          ▼                                          │
│  ┌────────────────────────────────────────────────────────┐              │
│  │       geminiService.ts (API Client)                 │              │
│  │  • Configures Gemini API                            │              │
│  │  • Builds prompts                                  │              │
│  │  • Parses responses                                │              │
│  └───────────────────────┬────────────────────────┘              │
│                          │                                          │
│                          ▼                                          │
│  ┌────────────────────────────────────────────────────────┐              │
│  │            Google Gemini API                          │              │
│  │  https://generativelanguage.googleapis.com            │              │
│  │  Model: gemini-2.0-flash                            │              │
│  └────────────────────────────────────────────────────────┘              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
USER INPUT                    PROCESSING                      RESULT
───────────────────────────────────────────────────────────────────────────────
Target: $5,000              1. Send to Gemini API         Recommended: $104/week
Duration: 12 months         2. AI analyzes             Feasibility: 85%
Frequency: Weekly           3. AI predicts           Tips: "Consider..."
Balance: $48,562           4. Return JSON            Reasoning: "Based on..."
```

---

## Implementation

### File 1: core/services/geminiService.ts

Create this file to handle communication with Google's servers.

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export interface GoalPredictionInput {
  userBalance: number;
  targetAmount: number;
  duration: string;
  frequency: string;
  monthlyIncome?: number;
}

export interface GoalPredictionOutput {
  recommendedDeposit: number;
  recommendedDuration: string;
  feasibility: number;
  tips: string[];
  reasoning: string;
}

export async function getGoalPrediction(
  input: GoalPredictionInput,
): Promise<GoalPredictionOutput> {
  const prompt = `
You are a financial AI advisor specializing in savings goals.

Analyze the following user data and provide a savings prediction:

USER DATA:
- Current Balance: $${input.userBalance}
- Savings Goal: $${input.targetAmount}
- Target Duration: ${input.duration}
- Deposit Frequency: ${input.frequency}
${input.monthlyIncome ? `- Monthly Income: $${input.monthlyIncome}` : ""}

Based on this data, provide a JSON response with the following structure:
{
  "recommendedDeposit": (number - the optimal deposit amount per period),
  "recommendedDuration": (string - the recommended duration in months),
  "feasibility": (number 0-100 - how achievable is this goal),
  "tips": (array of 2-3 short financial tips),
  "reasoning": (string - explanation of your recommendation)
}

Consider:
- A safe savings rate is 20-30% of income
- Keep 3-6 months of expenses as emergency fund
- Shorter duration means higher monthly deposits
- If the goal seems unrealistic, suggest adjustments

Return ONLY valid JSON, no other text.
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Parse the JSON response from AI
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid response from Gemini API");
  }

  return JSON.parse(jsonMatch[0]) as GoalPredictionOutput;
}
```

### File 2: features/goals/hooks/useGoalPrediction.ts

Create this hook to connect the service to your UI components.

```typescript
import { useState, useCallback } from "react";
import {
  getGoalPrediction,
  type GoalPredictionInput,
  type GoalPredictionOutput,
} from "@/core/services/geminiService";

interface UseGoalPredictionReturn {
  prediction: GoalPredictionOutput | null;
  isLoading: boolean;
  error: string | null;
  fetchPrediction: (input: GoalPredictionInput) => Promise<void>;
}

export function useGoalPrediction(): UseGoalPredictionReturn {
  const [prediction, setPrediction] = useState<GoalPredictionOutput | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = useCallback(async (input: GoalPredictionInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getGoalPrediction(input);
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get prediction");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { prediction, isLoading, error, fetchPrediction };
}
```

### File 3: Update CreateGoalScreen.tsx

Replace the simple calculation with AI prediction.

**Current code (lines 60-64):**

```typescript
const amount = parseFloat(form.targetAmount) || 0;
const months = form.duration === "6mo" ? 6 : form.duration === "12mo" ? 12 : 24;
const depositsPerMonth = form.frequency === "Weekly" ? 4.33 : 1;
const estimatedDeposit =
  amount > 0 ? Math.round(amount / (months * depositsPerMonth)) : 0;
```

**Replace with:**

```typescript
import { useGoalPrediction } from '../hooks/useGoalPrediction';
import { useTransactionStore } from '@/features/transactions/store/transactionStore';

export default function CreateGoalScreen() {
  const router = useRouter();
  const addGoal = useGoalsStore((state) => state.addGoal);

  // Get user balance from transaction store
  const balance = useTransactionStore((state) => state.balance);

  // AI prediction hook
  const { prediction, isLoading, error, fetchPrediction } = useGoalPrediction();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CreateGoalForm>({
    categoryId: "travel",
    targetAmount: "",
    goalName: "",
    targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    duration: "12mo",
    frequency: "Monthly",
  });

  const selectedCat = CATEGORY_ICONS.find((c) => c.id === form.categoryId)!;
  const amount = parseFloat(form.targetAmount) || 0;

  // Fetch AI prediction when amount or duration changes
  useEffect(() => {
    if (amount > 0) {
      fetchPrediction({
        userBalance: balance,
        targetAmount: amount,
        duration: form.duration,
        frequency: form.frequency,
      });
    }
  }, [amount, form.duration, form.frequency, balance]);

  // Calculate fallback if no AI prediction yet
  const months = form.duration === "6mo" ? 6 : form.duration === "12mo" ? 12 : 24;
  const depositsPerMonth = form.frequency === "Weekly" ? 4.33 : 1;
  const estimatedDeposit = prediction?.recommendedDeposit
    ?? (amount > 0 ? Math.round(amount / (months * depositsPerMonth)) : 0);

  // In the AI card section (around line 255), update to show:
  const renderStep3 = () => (
    <>
      {/* ... existing code ... */}

      <View style={s.aiCard}>
        <View style={s.aiRow}>
          <Ionicons name="sparkles" size={18} color="#3B5BDB" />
          <Text style={s.aiTitle}>AI ESTIMATION</Text>
        </View>

        {isLoading ? (
          <Text style={s.aiBody}>Analyzing your finances...</Text>
        ) : prediction ? (
          <>
            <Text style={s.aiBody}>
              To reach your goal of{" "}
              <Text style={s.aiLink}>${amount.toLocaleString()}</Text> by{" "}
              {form.targetDate}, save{" "}
              <Text style={s.aiLink}>
                ${prediction.recommendedDeposit}
              </Text>{" "}
              {form.frequency.toLowerCase()}.
            </Text>
            {prediction.feasibility < 70 && (
              <Text style={s.aiWarning}>
                ⚠️ Feasibility: {prediction.feasibility}%
                ({prediction.recommendedDuration} recommended)
              </Text>
            )}
            {prediction.tips.length > 0 && (
              <Text style={s.aiTips}>
                💡 {prediction.tips.join(' | ')}
              </Text>
            )}
          </>
        ) : (
          <Text style={s.aiBody}>
            To reach your goal of{" "}
            <Text style={s.aiLink}>${amount.toLocaleString()}</Text> by{" "}
            {form.targetDate}, save{" "}
            <Text style={s.aiLink}>${estimatedDeposit}</Text> {form.frequency.toLowerCase()}.
          </Text>
        )}
      </View>
    </>
  );
}
```

### File 4: Add Styles (if needed)

Add these styles to `CreateGoalScreen.styles.ts`:

```typescript
aiWarning: {
  fontSize: 13,
  color: '#F59E0B',
  marginTop: 8,
  fontWeight: '500',
},
aiTips: {
  fontSize: 12,
  color: '#10B981',
  marginTop: 8,
  fontStyle: 'italic',
},
```

---

## Flow Diagram

```
                         ┌─────────────────────┐
                         │   USER OPENS APP     │
                         └─────────┬───────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│         USER CREATES NEW SAVINGS GOAL                      │
│  • Enters target amount: $5,000                       │
│  • Selects duration: 12 months                        │
│  • Selects frequency: Weekly                          │
└─────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│         useGoalPrediction() HOOK TRIGGERS                │
│                                                          │
│  Calls: fetchPrediction({                             │
│    userBalance: 48562,    // from transactionStore     │
│    targetAmount: 5000,     // from user input        │
│    duration: "12mo",      // from user input        │
│    frequency: "Weekly"     // from user input        │
│  })                                                  │
└─────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│         geminiService SENDS REQUEST                    │
│                                                          │
│  POST to: https://generativelanguage.googleapis.com/      │
│          v1beta/models/gemini-2.0-flash:generateContent │
│                                                          │
│  Prompt: "You are a financial AI advisor...           │
│           User has $48,562 balance, wants $5,000     │
│           in 12 months..."                          │
└─────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│         GOOGLE GEMINI PROCESSES AI LOGIC                │
│                                                          │
│  AI analyzes:                                          │
│  • 30% of balance = safe to save = $14,568            │
│  • 12 months = need $417/month                        │
│  • Weekly = $104/week                                 │
│  • Feasibility = 85%                                  │
└─────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│         API RETURNS JSON RESPONSE                      │
│                                                          │
│  {                                                      │
│    "recommendedDeposit": 104,                            │
│    "recommendedDuration": "10 months",                   │
│    "feasibility": 85,                                   │
│    "tips": [                                            │
│      "Consider starting with $100 weekly",                │
│      "You could reach goal 2 months faster"             │
│    ],                                                  │
│    "reasoning": "Based on your balance..."             │
│  }                                                      │
└─────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│         UI DISPLAYS AI RESULTS                         │
│                                                          │
│  ┌─────────────────────────────────────────────┐        │
│  │  🤖 AI ESTIMATION                         │        │
│  │                                       │        │
│  │  To reach $5,000 by April 2027:        │        │
│  │  • Save $104 weekly (AI suggests)      │        │
│  │  • Feasibility: 85%                  │        │
│  │  • Tip: Consider starting with $100   │        │
│  └─────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘
```

---

## Files Reference

| File                                             | Action | Description         |
| ------------------------------------------------ | ------ | ------------------- |
| `.env`                                           | Create | Store API key       |
| `core/services/geminiService.ts`                 | Create | Handle API calls    |
| `features/goals/hooks/useGoalPrediction.ts`      | Create | Hook for components |
| `features/goals/components/CreateGoalScreen.tsx` | Update | Use AI prediction   |
| `CreateGoalScreen.styles.ts`                     | Update | Add AI styles       |

---

## Testing

### 1. Test API Key

Run this in your terminal:

```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}'
```

### 2. Test the App

```bash
npm start
```

- Create a new goal
- Enter amount (e.g., $5,000)
- Select duration
- Check the estimation card

### 3. Expected Output

```
🤖 AI ESTIMATION

To reach your goal of $5,000 by April 21, 2027, save $104 weekly.

⚠️ Feasibility: 85% (10 months recommended)

💡 Consider starting with $100 weekly | You could reach goal 2 months faster
```

---

## Troubleshooting

### Error: GEMINI_API_KEY is not defined

**Solution:** Create `.env` file with your API key:

```
GEMINI_API_KEY=AIzaSy...
```

### Error: Invalid response from Gemini API

**Solution:** Check the prompt format. The AI might be returning text instead of JSON. Update the parsing in `geminiService.ts`:

````typescript
// More robust parsing
const cleanResponse = response
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();
const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
````

### Error: API quota exceeded

**Solution:** You're on the free tier. Wait and try again, or check:

- https://aistudio.google.com/app/apikey

### Error: Network request failed

**Solution:** Check your internet connection. The API requires an active connection.

---

## Pricing

| Model            | Input   | Output  | Free Tier     |
| ---------------- | ------- | ------- | ------------- |
| gemini-2.0-flash | $0.00/M | $0.00/M | 1M tokens/min |
| gemini-2.5-flash | $0.00/M | $0.00/M | 1M tokens/min |

For typical savings predictions, it's essentially free.

---

## Security Notes

1. **Never commit API keys** - Add `.env` to `.gitignore`
2. **Use environment variables** - Never hardcode keys in source code
3. **Rate limiting** - The free tier has limits
4. **API key restrictions** - In Google AI Studio, you can restrict keys to your domain

---

## Resources

- [Google AI Studio](https://aistudio.google.com/app/apikey)
- [Gemini API Docs](https://ai.google.dev/docs)
- [@google/generative-ai npm](https://www.npmjs.com/package/@google/generative-ai)
- [Gemini API Pricing](https://ai.google.dev/pricing)
