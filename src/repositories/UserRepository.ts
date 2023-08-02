import {User} from "../types/models";
import db from "../config/db";

class UserRepository {
  private db = db("users");

  /**
   * Create user
   */
  create(data: User): Promise<number[]> {
    return this.db.insert(data);
  }

  /**
   * Update user
   */
  update(id: number, data: User): Promise<1 | 0> {
    return this.db.where({id}).update(data);
  }

  /**
   * Get user
   */
  find(id: number): Promise<User | undefined> {
    return this.db.where({id}).first();
  }
}

export default UserRepository;
