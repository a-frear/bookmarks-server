const knex = require('knex')
const app = require('../src/app')
const { bookmarksArray } = require('./bookmarks.fixtures')

describe('Bookmarks Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  before('clean the table', () => db('bookmarks').truncate())

  afterEach('cleanup', () => db('bookmarks').truncate())

  after('disconnect from db', () => db.destroy())

  describe('GET /bookmarks', () => {
      context('Given no bookmarks', () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
            .get('/bookmarks')
            .expect(200, [])
          })
      })

      context('Given there are bookmarks in the database', () => {
        const testBookmarks = bookmarksArray()
  
        beforeEach('insert articles', () => {
          return db
            .into('bookmarks')
            .insert(testBookmarks)
        })
  
        it('responds with 200 and all of the bookmarks', () => {
          return supertest(app)
            .get('/bookmarks')
            .expect(200, testBookmarks)
        })

  })
})
})