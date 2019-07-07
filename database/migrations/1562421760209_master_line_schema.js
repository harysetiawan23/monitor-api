'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MasterLineSchema extends Schema {
  up () {
    this.create('master_lines', (table) => {
      table.increments()
      table.string('name', 100);
      table.string('start', 100).nullable().default('text');
      table.string('end', 100).nullable().default('text');
      table.integer('distance').unsigned().nullable().default(0);
      table.integer('diameter').unsigned().nullable().default(0);
      table.integer('thicknes').unsigned().nullable().default(0);
      table.string('manufacture', 100).nullable().default('N/A');
      table.integer('user_id').unsigned();
      table.integer('start_node_id').unsigned().nullable().default(12);
      table.integer('end_node_id').unsigned().nullable().default(12);
      table.timestamps();
      // table.foreign('user_id').references('id').on('users').onDelete('cascade');
      table.foreign('start_node_id').references('id').on('master_nodes').onDelete('cascade');
      table.foreign('end_node_id').references('id').on('master_nodes').onDelete('cascade');
    })
  }

  down () {
    this.drop('master_lines')
  }
}

module.exports = MasterLineSchema
