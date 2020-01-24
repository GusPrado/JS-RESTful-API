const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')

const app = express()

app.set('view engine', 'ejs')

//app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {console.log('Connected to MongoDB')})
  .catch((error) => {console.log(error)})

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema)


app.route('/articles')
  .get((req, res) => {
  Article.find({}, (err, results) => {
    if (!err) {
      res.json(results)
    } else {
      console.log(err)
      res.status(400).json({message: 'There is something wrong'})
    }
  })
})

  .post(async (req, res) => {
  const article = await Article.create({
    title: req.body.title,
    content: req.body.content
  }, (err) => {
    if(!err) {
      res.status(200).json({message: 'New article created'})
    } else {
      res.send(error)
    }
  })
})

  .delete((req, res) => {
  Article.deleteMany((err) => {
    if (!err) {
      res.status(200).json({message: 'All articles deleted'})
    } else {
      res.send(error)
    }
  })
})

app.get('/:id', (req, res) => {
  console.log(req.params.id)
})


app.listen(3000, () => console.log('Server running on port #3000'))