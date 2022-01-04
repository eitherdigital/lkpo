'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReleasesSchema extends Schema {
  up () {
    this.create('releases', (table) => {
      table.increments()
      table.string('name', 255).notNullable()
      table.string('main_artist', 255).notNullable()
      table.string('another_artists', 255)
      table.string('genre', 255).notNullable()
      table.string('version', 255)
      table.boolean('explicit').notNullable()
      table.string('author', 255).notNullable()
      table.string('date').notNullable()
      table.string('link').notNullable()
      table.boolean('accepted').notNullable()
      table.boolean('user_id').notNullable()
      table.string('reason')
      table.string('upc')
      table.string('isrc')
      table.string('cover').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('releases')
  }
}

module.exports = ReleasesSchema
