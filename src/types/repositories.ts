import TransactionRepository from "../repositories/TransactionRepository";
import UserRepository from "../repositories/UserRepository";
import WalletRepository from "../repositories/WalletRepository";

export type Repository =
  | UserRepository
  | WalletRepository
  | TransactionRepository;
