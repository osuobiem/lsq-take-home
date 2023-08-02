import {TransactionType} from "../utils/enums";

export type User = {
  id?: number;
  name: string;
  email: string;
  accessToken?: string;
  password: string;
  created_at?: string;
  updated_at?: string;
};

export type CreateUser = {
  name: string;
  email: string;
  password: string;
};

export type Wallet = {
  balance: number;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
};

export type Transaction = {
  amount: number;
  type: TransactionType;
  from: string;
  to: string;
};
