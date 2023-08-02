import {Knex} from "knex";
import {TransactionType} from "../utils/enums";

export async function up(knex: Knex): Promise<void> {
  return (
    knex.schema

      // users table
      .createTable("users", function (table) {
        table.increments("id");
        table.string("name", 255).notNullable();
        table.string("email", 255).notNullable().unique();
        table.string("password", 255).notNullable();
        table.string("accessToken", 255).notNullable();
        table.timestamps(true, true);
      })

      // wallets table
      .createTable("wallets", function (table) {
        table.increments("id");
        table.decimal("balance", 2).defaultTo(0);
        table.integer("user_id").unsigned();
        table
          .foreign("user_id")
          .references("id")
          .inTable("users")
          .onDelete("cascade");
        table.timestamps(true, true);
      })

      // transactions table
      .createTable("transactions", function (table) {
        table.increments("id");
        table.decimal("amount", 2).notNullable();
        table.enum("type", [
          TransactionType.FUND,
          TransactionType.TRANSFER,
          TransactionType.WITHDRAW,
        ]);
        table.integer("from_wallet").unsigned();
        table.integer("to_wallet").unsigned();
        table
          .foreign("from_wallet")
          .references("id")
          .inTable("wallets")
          .onDelete("cascade");
        table
          .foreign("to_wallet")
          .references("id")
          .inTable("wallets")
          .onDelete("cascade");
        table.timestamps(true, true);
      })
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("users")
    .dropTable("wallets")
    .dropTable("transactions");
}
