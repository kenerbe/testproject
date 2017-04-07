// Nodejs express CRUD using mongodb server side app
// This is from Zell Liew's great blog article
//
//    https://zellwk.com/blog/crud-express-mongodb/
//
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

// Grab the mlab MongoDB URI string from the DB_ENV environment var
const MyDB = process.env.DB_ENV

var db

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    console.log('read the database items')
    res.render('index.ejs', {quotes: result})
  })
})

app.post('/quotes', (req, res) => {
  if (req.body.name.length > 0 && req.body.quote.length > 0) {
    db.collection('quotes').save(req.body, (err, result) => {
      if (err) return console.log(err)

      console.log('created a database item')
      res.redirect('/')
    })
  }
})

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    console.log('updated a database item')
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    console.log('deleted a database item')
    res.send(result)
  })
})

MongoClient.connect(MyDB, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})
