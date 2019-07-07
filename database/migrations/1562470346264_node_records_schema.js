'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NodeRecordsSchema extends Schema {
  up () {
    this.create('node_records', (table) => {
      table.increments()
      table.integer('line_id').unsigned()
      table.tinyint('isStartNode')
      table.double('flow',8,2)
      table.double('pressure',8,2)
      table.timestamps()
    })
  }

  down () {
    this.drop('node_records')
  }
}

module.exports = NodeRecordsSchema
