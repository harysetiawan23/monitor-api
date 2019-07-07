'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LeakEventsSchema extends Schema {
  up () {
    this.create('leak_events', (table) => {
      table.increments()
      table.integer('line_id')
      table.boolean('informed')
      table.boolean('solved')
      table.integer('user_id').unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('leak_events')
  }
}

module.exports = LeakEventsSchema
