const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
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

////////////// Requests targetting all articles  //////////////////

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

////////////// Requests targetting all articles  //////////////////

app.route('/articles/:articleTitle')
  .get((req, res) => {
    const { articleTitle } = req.params

    Article.findOne({
      title: articleTitle
    }, (err, foundArticle) => {
      if (foundArticle) {
        res.status(200).json(foundArticle)
      } else {
        res.status(400).json({ message: 'No articles found'})
      }
    })
  })

  .put((req, res) => {
    const { articleTitle } = req.params
    const { title, content } = req.body
    // console.log('passou')
    // console.log(articleTitle,title,content)

    Article.update(
      {title: articleTitle},
      {title, content},
      {overwrite: true}),
      (err) => {
        if(!err) {
          res.status(200).json({message: 'Article updated'})
        }
      }
  })

  .patch((req, res) => {
    const { articleTitle } = req.params
    console.log(req.body)
    Article.update(
      {title: articleTitle},
      {$set: req.body},
      (err) => {
        if (!err) {
          res.send('Updated article')
        } else {
          res.send(err)
        }
      }
    )
  })

  .delete((req, res) => {
    const { articleTitle } = req.params
    console.log(articleTitle)

    Article.findOneAndDelete({
      title: articleTitle
    }, (err) => {
      if (err) {
        throw(err)
      } res.status(200).json('deleted')
    })
  })


app.listen(3000, () => console.log('Server running on port #3000'))