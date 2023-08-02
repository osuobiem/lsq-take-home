import db from "../config/db";
import BaseRepository from "./BaseRepostory";

class WalletRepository extends BaseRepository {
  constructor() {
    super(db("wallets"));
  }
}

export default WalletRepository;
