import db from "../config/db";
import {Transaction} from "../types/models";
import BaseRepository from "./BaseRepostory";

class TransactionRepository extends BaseRepository {
  constructor() {
    super(db("transactions"));
  }
}

export default TransactionRepository;
