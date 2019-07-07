'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NodeRecapSchema extends Schema {
  up () {
    this.create('node_recaps', (table) => {
      table.increments()
      table.integer('line_id')
      table.double('flow_leak_ratio')
      table.double('pressure_leak_ratio')
      table.double('start_flow')
      table.double('end_flow')
      table.double('start_pressure')
      table.double('end_pressure')
      table.integer('user_id').unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('node_recaps')
  }
}

module.exports = NodeRecapSchema
