import db from "../config/db";
import BaseRepository from "./BaseRepostory";

class WalletRepository extends BaseRepository {
  constructor() {
    super(db("wallets"));
  }

  async updateBalance(walletId: number, newBalance: number): Promise<number> {
    return this.db.where("id", walletId).update({balance: newBalance});
  }
}

export default WalletRepository;
