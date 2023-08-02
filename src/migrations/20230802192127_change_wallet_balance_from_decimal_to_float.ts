import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("wallets", function (table) {
      table.float("balance").defaultTo(0).alter();
    })
    .alterTable("transactions", function (table) {
      table.float("amount").defaultTo(0).alter();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("wallets", function (table) {
      table.decimal("balance", 2).defaultTo(0).alter();
    })
    .alterTable("transactions", function (table) {
      table.decimal("amount", 2).defaultTo(0).alter();
    });
}
