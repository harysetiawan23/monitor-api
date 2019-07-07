'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MasterNodeSchema extends Schema {
  up () {
    this.create('master_nodes', (table) => {
      table.increments()
      table.string("sn", 100).nullable().default("text");
      table.string("phone_number", 100).nullable().default("text");
      table.string("lat", 100).nullable().default("text");
      table.string("lng", 100).nullable().default("text");
      table.boolean("isStartNode").nullable().default(false);
      table.string("flow_rate_model", 100).nullable().default("text");
      table.string("pressure_tranducer_model", 100).nullable().default("text");
      table.double("pressOffset", 100)
      table.string("liquidFlowKonstanta", 100)
      table.integer("user_id").unsigned().nullable().default(12);
      table.boolean("isOnline").nullable().default(false);
      // table
      //   .foreign("user_id")
      //   .references("id")
      //   .on("users")
      //   .onDelete("cascade");
      table.timestamps()
    })
  }

  down () {
    this.drop('master_nodes')
  }
}

module.exports = MasterNodeSchema
