import {TransactionType} from "../utils/enums";

export type User = {
  name: string;
  email: string;
  accessToken?: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
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
