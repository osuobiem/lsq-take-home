import db from "../config/db";
import BaseRepository from "./BaseRepostory";

class UserRepository extends BaseRepository {
  constructor() {
    super(db("users"));
  }
}

export default UserRepository;
