import type {Knex} from "knex";

class BaseRepository {
  protected db: Knex.QueryBuilder;

  constructor(db: Knex.QueryBuilder) {
    this.db = db;
  }

  /**
   * Create
   */
  create(data: any): Promise<number[]> {
    return this.db.insert(data);
  }

  /**
   * Update
   */
  update(id: number, data: any): Promise<1 | 0> {
    return this.db.where({id}).update(data);
  }

  /**
   * Get single record
   */
  find(by: object = {}): Promise<any | undefined> {
    return this.db.where({...by}).first();
  }

  /**
   * Get by filter
   */
  get(filter: object = {}): Promise<any[]> {
    return this.db.where({...filter}).select();
  }

  /**
   * Delete record
   */
  delete(by: object = {}): Promise<any | number> {
    return this.db.where({...by}).delete();
  }
}

export default BaseRepository;
