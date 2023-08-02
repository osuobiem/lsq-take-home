import db from "../config/db";
import {Transaction} from "../types/models";
import BaseRepository from "./BaseRepostory";

class TransactionRepository extends BaseRepository {
  constructor() {
    super(db("transactions"));
  }

  /**
   * Get wallet transactions
   */
  walletTransactions(wallet_id: number): Promise<Transaction[]> {
    return this.db
      .where({from_wallet: wallet_id})
      .orWhere({to_wallet: wallet_id})
      .select();
  }
}

export default TransactionRepository;
