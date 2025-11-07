export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'Breakfast' | 'Lunch' | 'Evening Snack' | 'Beverage';
}

export interface MealSelection {
  user: User;
  items: FoodItem[];
  date: Date;
  optedOut?: boolean;
}

export type View = 'customer' | 'admin';

export interface User {
  name:string;
  email: string;
  photoUrl: string;
  isAdmin: boolean;
}