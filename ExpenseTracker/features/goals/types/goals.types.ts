export interface GoalCategoryData {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface GoalData {
  _id: string;
  name: string;
  duration: string;
  frequency: string;
  category: GoalCategoryData;
  target: number;
  createdAt: string;
  updatedAt: string;
}

export interface GoalCategoryDisplay {
  id: string;
  label: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
}

export interface CreateGoalForm {
  categoryId: string;
  target: string;
  name: string;
  duration: string;
  frequency: string;
}
