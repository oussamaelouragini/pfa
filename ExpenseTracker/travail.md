# ExpenseTracker - Informations pour Backend (Fadi)

## Vue d'ensemble du projet

Application mobile de suivi des dépenses développée avec React Native/Expo. Le frontend est géré par Oussama, le backend doit être développé avec Express.js, TypeScript et MongoDB.

## Technologies utilisées

- **Frontend**: React Native, Expo, TypeScript
- **Backend**: Express.js, TypeScript, MongoDB
- **Authentification**: JWT tokens
- **State Management**: Zustand, React Query
- **Validation**: Zod, React Hook Form

## Architecture des données

### 1. Utilisateur (User)

```typescript
interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}
```

### 2. Authentification

```typescript
interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}
```

### 3. Transactions

```typescript
type TransactionType = "Expense" | "Income";

type CategoryId =
  | "shopping"
  | "food"
  | "transport"
  | "rent"
  | "health"
  | "salary"
  | "other";

interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
}

interface Transaction {
  id: string;
  title: string;
  category: string;
  categoryId: CategoryId;
  time: string;
  amount: number; // négatif = expense, positif = income
  status: "APPROVED" | "COMPLETED" | "PENDING";
  icon: string;
  iconBgColor: string;
  iconColor: string;
  createdAt: number; // timestamp
  userId: string; // référence vers l'utilisateur
}
```

### 4. Objectifs (Goals)

```typescript
type GoalCategoryId =
  | "travel"
  | "home"
  | "car"
  | "education"
  | "investment"
  | "tech"
  | "emergency"
  | "other";

type DepositFrequency = "Weekly" | "Monthly";
type GoalDuration = "6mo" | "12mo" | "2yrs";

interface GoalCategory {
  id: GoalCategoryId;
  label: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  description: string;
}

interface ActiveGoal {
  id: string;
  name: string;
  categoryId: GoalCategoryId;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  targetAmount: number;
  savedAmount: number;
  monthsRemaining: number;
  userId: string;
  createdAt: string;
  targetDate: string;
  frequency: DepositFrequency;
  duration: GoalDuration;
}
```

### 5. Portefeuille (Wallet)

```typescript
interface Card {
  id: string;
  label: string; // "ACTIVE CARD" / "SECOND CARD"
  name: string; // "Digital Black"
  last4: string; // "1095"
  expiry: string; // "08/28"
  network: string; // "VISA" / "GLOBAL"
  isDark: boolean;
  color1: string; // gradient start
  color2: string; // gradient end
  userId: string;
}

interface Account {
  id: string;
  name: string; // "Main Checking"
  bank: string; // "Chase"
  last4: string; // "4421"
  balance: number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  badge?: string; // "4.2% APY"
  badgeColor?: string;
  userId: string;
}

interface WalletActivity {
  id: string;
  title: string;
  time: string;
  amount: number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  userId: string;
}
```

### 6. Statistiques (Stats)

```typescript
type TabPeriod = "Weekly" | "Monthly";

interface ChartDataPoint {
  day: string;
  income: number;
  expense: number;
  userId: string;
  period: TabPeriod;
}

interface SpendingCategory {
  id: string;
  label: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  amount: number;
  maxAmount: number;
  barColor: string;
  userId: string;
  period: TabPeriod;
}

interface SummaryCard {
  id: string;
  label: string;
  amount: number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  accentColor: string;
  userId: string;
  period: TabPeriod;
}
```

## APIs nécessaires

### Authentification

1. **POST /api/auth/signup**
   - Body: SignUpPayload
   - Response: AuthResponse

2. **POST /api/auth/signin**
   - Body: SignInPayload
   - Response: AuthResponse

3. **POST /api/auth/refresh**
   - Headers: Authorization: Bearer {token}
   - Response: { token: string }

4. **GET /api/auth/me**
   - Headers: Authorization: Bearer {token}
   - Response: User

### Transactions

1. **GET /api/transactions**
   - Query: ?page=1&limit=20&startDate=&endDate=
   - Headers: Authorization: Bearer {token}
   - Response: { transactions: Transaction[], total: number, page: number }

2. **POST /api/transactions**
   - Body: { title: string, categoryId: CategoryId, amount: number, type: TransactionType }
   - Headers: Authorization: Bearer {token}
   - Response: Transaction

3. **PUT /api/transactions/:id**
   - Body: Partial<Transaction>
   - Headers: Authorization: Bearer {token}
   - Response: Transaction

4. **DELETE /api/transactions/:id**
   - Headers: Authorization: Bearer {token}
   - Response: { success: true }

5. **GET /api/transactions/categories**
   - Response: Category[]

### Objectifs (Goals)

1. **GET /api/goals**
   - Headers: Authorization: Bearer {token}
   - Response: ActiveGoal[]

2. **POST /api/goals**
   - Body: CreateGoalForm
   - Headers: Authorization: Bearer {token}
   - Response: ActiveGoal

3. **PUT /api/goals/:id**
   - Body: Partial<ActiveGoal>
   - Headers: Authorization: Bearer {token}
   - Response: ActiveGoal

4. **DELETE /api/goals/:id**
   - Headers: Authorization: Bearer {token}
   - Response: { success: true }

5. **GET /api/goals/categories**
   - Response: GoalCategory[]

6. **POST /api/goals/:id/deposit**
   - Body: { amount: number }
   - Headers: Authorization: Bearer {token}
   - Response: ActiveGoal

### Portefeuille (Wallet)

1. **GET /api/wallet/cards**
   - Headers: Authorization: Bearer {token}
   - Response: Card[]

2. **GET /api/wallet/accounts**
   - Headers: Authorization: Bearer {token}
   - Response: Account[]

3. **GET /api/wallet/activity**
   - Query: ?page=1&limit=20
   - Headers: Authorization: Bearer {token}
   - Response: { activities: WalletActivity[], total: number }

4. **POST /api/wallet/cards**
   - Body: Omit<Card, 'id' | 'userId'>
   - Headers: Authorization: Bearer {token}
   - Response: Card

5. **POST /api/wallet/accounts**
   - Body: Omit<Account, 'id' | 'userId'>
   - Headers: Authorization: Bearer {token}
   - Response: Account

### Statistiques (Stats)

1. **GET /api/stats/summary**
   - Query: ?period=Weekly|Monthly
   - Headers: Authorization: Bearer {token}
   - Response: { summaryCards: SummaryCard[], totalIncome: number, totalExpense: number }

2. **GET /api/stats/chart**
   - Query: ?period=Weekly|Monthly
   - Headers: Authorization: Bearer {token}
   - Response: ChartDataPoint[]

3. **GET /api/stats/categories**
   - Query: ?period=Weekly|Monthly
   - Headers: Authorization: Bearer {token}
   - Response: SpendingCategory[]

## Fonctionnalités principales

### 1. Authentification

- Inscription avec email, mot de passe, nom complet
- Connexion avec email et mot de passe
- Persistance du token dans AsyncStorage
- Protection des routes avec middleware JWT

### 2. Dashboard

- Affichage du solde total
- Liste des transactions récentes (5-10 dernières)
- Actions rapides (ajouter transaction, voir stats, etc.)
- Graphique des dépenses/incomes

### 3. Transactions

- Ajout de nouvelles transactions (dépenses/incomes)
- Catégorisation automatique
- Historique paginé
- Modification/suppression
- Recherche et filtrage par date/catégorie

### 4. Objectifs

- Création d'objectifs d'épargne
- Catégories prédéfinies
- Calcul automatique des dépôts (hebdomadaire/mensuel)
- Suivi de progression
- Notifications quand objectif atteint

### 5. Portefeuille

- Gestion des cartes de crédit
- Comptes bancaires
- Historique des activités
- Intégration potentielle avec APIs bancaires

### 6. Statistiques

- Graphiques des dépenses/incomes
- Répartition par catégories
- Périodes (hebdomadaire/mensuelle)
- Comparaisons mois par mois

## Configuration requise

### Base de données MongoDB

Collections nécessaires:

- users
- transactions
- goals
- cards
- accounts
- wallet_activities

### Variables d'environnement

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expensetracker
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

### Middleware nécessaire

- Authentification JWT
- Validation des données (Zod recommandé)
- Gestion d'erreurs
- CORS
- Rate limiting
- Logging

### Sécurité

- Hashage des mots de passe (bcrypt)
- Validation des emails
- Sanitisation des inputs
- Protection contre les attaques XSS/CSRF
- Validation des tokens JWT

## Points d'attention

1. Toutes les requêtes nécessitent un token JWT valide
2. Les montants sont en centimes (pour éviter les problèmes de précision)
3. Les dates sont en timestamps Unix
4. Pagination nécessaire pour les listes longues
5. Validation côté serveur obligatoire
6. Gestion des erreurs cohérente (format JSON)

## Tests à implémenter

- Tests unitaires pour les contrôleurs
- Tests d'intégration pour les APIs
- Tests de sécurité (authentification, autorisation)
- Tests de performance pour les requêtes fréquentes

---

**Contact**: Oussama Elouragini (Frontend) - Pour toute question sur les spécifications</content>
<parameter name="filePath">c:\Dev\Mobile\pfa\ExpenseTracker\travail.md
