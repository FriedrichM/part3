require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('data', (req)=> {
  return JSON.stringify(req.body)
})

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


app.get('/info', (req, res) => {
  Person.countDocuments({}, (err, count)=> {
    if (err) {
      return response.status(500).json({error: 'db error'})
    }
    res.send('Phonebook has info on '+count+' people</br> '+new Date())
  }).catch(error => next(error));

})
app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => {
    res.json(result)
  }).catch(error => next(error))

})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined||body.number === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  if (!body.number||!body.name) {
    return response.status(400).json({
      error: 'required field missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id:Math.floor(Math.random()*1000000000000)
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const body = request.body

  if (body.name === undefined||body.number === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  if (!body.number||!body.name) {
    return response.status(400).json({
      error: 'required field missing'
    })
  }

  Person.findOneAndUpdate({id:id},
    {name:body.name, number:body.number},
    {returnOriginal: false})
    .then(savedPerson => {
      if(savedPerson){
        response.json(savedPerson)
      }else{
        response.status(404).end()
      }

  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = Person.findOne({id:id}).then(result => {
    if (result) {
      response.json(result)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id',(request, response) => {
  const id = Number(request.params.id)
  Person.deleteOne({ id: id }, ()=> {
    response.status(204).end()
  }).catch(error => next(error));
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else{
    return response.status(400).send({ error: 'unknown error' })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)
