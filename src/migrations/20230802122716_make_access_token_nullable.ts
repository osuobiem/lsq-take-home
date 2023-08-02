import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", function (table) {
    table.string("accessToken", 255).nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", function (table) {
    table.string("accessToken", 255).notNullable().alter();
  });
}
