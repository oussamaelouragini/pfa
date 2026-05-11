import { ChatCompletionTool } from 'groq-sdk/resources/chat/completions';

export const AI_TOOLS: ChatCompletionTool[] = [
  // ─── Expense Management ────────────────────────────────────────────────────
  {
    type: 'function',
    function: {
      name: 'create_expense',
      description:
        'Create a new expense transaction. Call when the user mentions spending, paying, or buying something. Extract amount, category, note, and date from context.',
      parameters: {
        type: 'object',
        properties: {
          amount: {
            type: 'number',
            description: 'Amount spent in TND (Tunisian Dinar)',
          },
          categoryName: {
            type: 'string',
            description:
              'Category name matching user categories (e.g., Food, Transport, Shopping, Health, Rent). Use best match.',
          },
          note: {
            type: 'string',
            description: 'Brief description of what was spent on (e.g., "coffee", "taxi to airport")',
          },
          date: {
            type: 'string',
            description:
              'Date in YYYY-MM-DD format. Infer from context: "yesterday" → previous day, "last Monday" → calculate. Default: today.',
          },
          isRecurring: {
            type: 'boolean',
            description: 'True only if user explicitly says it is recurring or monthly.',
          },
        },
        required: ['amount'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_transaction',
      description:
        'Update an existing transaction. Requires the transaction ID. First use get_transactions to find the ID if not known.',
      parameters: {
        type: 'object',
        properties: {
          transactionId: {
            type: 'string',
            description: 'MongoDB ObjectId of the transaction to update.',
          },
          amount: { type: 'number', description: 'New amount in TND' },
          categoryName: { type: 'string', description: 'New category name' },
          note: { type: 'string', description: 'New note' },
          date: { type: 'string', description: 'New date YYYY-MM-DD' },
          isRecurring: { type: 'boolean' },
        },
        required: ['transactionId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'delete_transaction',
      description:
        'Delete a transaction permanently. Requires the transaction ID. Confirm with user before calling.',
      parameters: {
        type: 'object',
        properties: {
          transactionId: {
            type: 'string',
            description: 'MongoDB ObjectId of the transaction to delete.',
          },
        },
        required: ['transactionId'],
      },
    },
  },

  // ─── Income Management ─────────────────────────────────────────────────────
  {
    type: 'function',
    function: {
      name: 'create_income',
      description:
        'Record income. Call when user mentions receiving money, salary, payment, or earnings.',
      parameters: {
        type: 'object',
        properties: {
          amount: {
            type: 'number',
            description: 'Income amount in TND',
          },
          categoryName: {
            type: 'string',
            description: 'Income category (e.g., Salary, Freelance)',
          },
          note: {
            type: 'string',
            description: 'Description of income source',
          },
          date: {
            type: 'string',
            description: 'Date in YYYY-MM-DD format. Default: today.',
          },
        },
        required: ['amount'],
      },
    },
  },

  // ─── Transaction Retrieval ─────────────────────────────────────────────────
  {
    type: 'function',
    function: {
      name: 'get_transactions',
      description:
        'Retrieve user transactions with optional filters. Use to look up specific transactions before updating/deleting.',
      parameters: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['expense', 'income'],
            description: 'Filter by transaction type',
          },
          startDate: { type: 'string', description: 'Start date YYYY-MM-DD' },
          endDate: { type: 'string', description: 'End date YYYY-MM-DD' },
          limit: {
            type: 'number',
            description: 'Max results (default 10, max 50)',
          },
          categoryName: {
            type: 'string',
            description: 'Filter by category name (case-insensitive)',
          },
        },
        required: [],
      },
    },
  },

  // ─── Analytics ─────────────────────────────────────────────────────────────
  {
    type: 'function',
    function: {
      name: 'get_spending_summary',
      description:
        'Get total spending and income for a time period. Use for questions like "how much did I spend this month?"',
      parameters: {
        type: 'object',
        properties: {
          period: {
            type: 'string',
            enum: ['today', 'week', 'month', 'last_month', 'year', 'custom'],
            description: 'Time period for the summary',
          },
          startDate: {
            type: 'string',
            description: 'Required when period=custom. YYYY-MM-DD',
          },
          endDate: {
            type: 'string',
            description: 'Required when period=custom. YYYY-MM-DD',
          },
        },
        required: ['period'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_category_breakdown',
      description:
        'Get spending broken down by category for a period. Use for questions about which category costs most.',
      parameters: {
        type: 'object',
        properties: {
          period: {
            type: 'string',
            enum: ['today', 'week', 'month', 'last_month', 'year', 'custom'],
          },
          startDate: { type: 'string', description: 'YYYY-MM-DD, required for custom' },
          endDate: { type: 'string', description: 'YYYY-MM-DD, required for custom' },
        },
        required: ['period'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'compare_periods',
      description:
        'Compare spending/income between two time periods. Use for month-over-month or week-over-week comparisons.',
      parameters: {
        type: 'object',
        properties: {
          period1: {
            type: 'string',
            enum: ['today', 'week', 'month', 'last_month', 'year'],
            description: 'First period (current)',
          },
          period2: {
            type: 'string',
            enum: ['today', 'week', 'month', 'last_month', 'year'],
            description: 'Second period (to compare against)',
          },
        },
        required: ['period1', 'period2'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'detect_anomalies',
      description:
        'Detect unusual or abnormal spending patterns. Use when user asks about risky spending or financial warnings.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_financial_overview',
      description:
        'Get a complete financial overview: net balance, total income, total expenses, this month vs last month. Use as a starting context or when user asks for a general summary.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },

  // ─── Goals ─────────────────────────────────────────────────────────────────
  {
    type: 'function',
    function: {
      name: 'get_goals',
      description: "Retrieve user's financial goals and savings targets.",
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_goal',
      description: 'Create a new financial goal or savings target.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Goal name (e.g., "Save for car", "Emergency fund")',
          },
          target: {
            type: 'number',
            description: 'Target amount in TND',
          },
          categoryName: {
            type: 'string',
            description: 'Related expense category',
          },
          duration: {
            type: 'string',
            description: 'Duration (e.g., "6 months", "1 year", "18 months")',
          },
          frequency: {
            type: 'string',
            description: 'Saving frequency (e.g., "monthly", "weekly", "bi-weekly")',
          },
        },
        required: ['name', 'target'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_goal',
      description: 'Update an existing goal. Requires goal ID from get_goals.',
      parameters: {
        type: 'object',
        properties: {
          goalId: { type: 'string', description: 'MongoDB ObjectId of the goal' },
          name: { type: 'string' },
          target: { type: 'number' },
          categoryName: { type: 'string' },
          duration: { type: 'string' },
          frequency: { type: 'string' },
        },
        required: ['goalId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'delete_goal',
      description: 'Delete a financial goal.',
      parameters: {
        type: 'object',
        properties: {
          goalId: { type: 'string', description: 'MongoDB ObjectId of the goal' },
        },
        required: ['goalId'],
      },
    },
  },

  // ─── Categories ────────────────────────────────────────────────────────────
  {
    type: 'function',
    function: {
      name: 'get_categories',
      description: "Get user's expense and income categories.",
      parameters: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['expense', 'income'],
            description: 'Filter by type. Omit for all categories.',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_category',
      description: 'Create a new custom category.',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Category name' },
          type: { type: 'string', enum: ['expense', 'income'], description: 'Category type' },
          icon: { type: 'string', description: 'Ionicons icon name (e.g., "cart-outline")' },
          color: { type: 'string', description: 'Hex color code (e.g., "#FF5733")' },
        },
        required: ['name', 'type'],
      },
    },
  },

  // ─── Predictions & Estimation ──────────────────────────────────────────────
  {
    type: 'function',
    function: {
      name: 'estimate_monthly_spending',
      description:
        'Estimate or predict monthly spending based on historical patterns. Use for forecasting questions.',
      parameters: {
        type: 'object',
        properties: {
          categoryName: {
            type: 'string',
            description: 'Optional: estimate for a specific category only',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'estimate_savings_potential',
      description:
        'Calculate how long it takes to save for a target amount, or how much can be saved monthly.',
      parameters: {
        type: 'object',
        properties: {
          targetAmount: {
            type: 'number',
            description: 'Target savings amount in TND',
          },
          monthlyContribution: {
            type: 'number',
            description:
              'Optional: monthly savings amount. If omitted, calculated from income minus expenses.',
          },
        },
        required: ['targetAmount'],
      },
    },
  },
];

// Tools requiring user confirmation before execution
export const DESTRUCTIVE_TOOLS = new Set([
  'create_expense',
  'create_income',
  'update_transaction',
  'delete_transaction',
  'create_goal',
  'update_goal',
  'delete_goal',
  'create_category',
]);

// Read-only tools that execute immediately without confirmation
export const READ_ONLY_TOOLS = new Set([
  'get_transactions',
  'get_spending_summary',
  'get_category_breakdown',
  'compare_periods',
  'detect_anomalies',
  'get_financial_overview',
  'get_goals',
  'get_categories',
  'estimate_monthly_spending',
  'estimate_savings_potential',
]);
