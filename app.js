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
    await Article.create({
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
  .get( async(req, res) => {
    const { articleTitle } = req.params

    const foundArticle =  await Article.findOne(
      {
        title: articleTitle
      }, (result) => {
        if (!result) {
          console.log('error')
        }
      })
      res.status(200).json(foundArticle)
    })

  .put((req, res) => {
    const { articleTitle } = req.params
    updateField = req.body

    console.log(articleTitle, updateField, typeof(updateField))

    Article.update(
      {title: articleTitle},
      updateField,
      {overwrite: true}),
      (err) => {
        if (!err) {
          console.log('executou')}
        //    res.status(200).json({message: 'article updated'})
        // } res.send(err)
        console.log('executou erro')      
      }    
  })

  .patch((req, res) => {
    const { articleTitle } = req.params

    Article.updateOne(
      {title: articleTitle},
      {$set: req.body},
      (err) => {
        if (!err) {
          res.status(200).json({message: 'article updated'})
        } else {
          res.send(err)
        }
      }
    )
  })

  .delete((req, res) => {
    const { articleTitle } = req.params

    Article.deleteOne({
      title: articleTitle
    }, (err, result) => {
      if (result) {
        res.status(200).json({message: 'article deleted'})
      } else {
        res.status(400).json({ message: 'No articles found'})
      }
    })
  })


app.listen(3000, () => console.log('Server running on port #3000'))