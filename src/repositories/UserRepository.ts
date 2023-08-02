import {User} from "../types/models";
import db from "../config/db";

class UserRepository {
  private db = db("users");
}

export default UserRepository;
