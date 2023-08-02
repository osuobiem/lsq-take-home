import db from "../config/db";
import {CreateUser} from "../types/models";
import AppError from "../utils/AppError";
import {ErrorMessage, HttpStatus} from "../utils/enums";
import BaseRepository from "./BaseRepostory";

class UserRepository extends BaseRepository {
  constructor() {
    super(db("users"));
  }

  /**
   * Create a new user
   */
  async create(data: CreateUser) {
    try {
      await db.transaction(async (trx) => {
        // Create the user and get the user_id
        const [userId] = await trx("users").insert(data);

        // Create the wallet for the user using user_id
        await trx("wallets").insert({
          user_id: userId,
        });
      });

      return true;
    } catch (error) {
      console.error("Error creating user and wallet:", error);
      return false;
    }
  }
}

export default UserRepository;
