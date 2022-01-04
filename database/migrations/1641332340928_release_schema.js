'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReleaseSchema extends Schema {
  up () {
    this.create('releases', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('releases')
  }
}

module.exports = ReleaseSchema
