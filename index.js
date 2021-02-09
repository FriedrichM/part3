const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('data', (req)=> {
  return JSON.stringify(req.body)
})

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server now running on port ${PORT}`)
})

let persons =  [
    {
      "name": "Arto Hellas",
      "number": "040-12345",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]

app.get('/info', (req, res) => {
  res.send('Phonebook has info on '+persons.length+' people</br> '+new Date())
})
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.number||!body.name) {
    return response.status(400).json({
      error: 'required field missing'
    })
  }
  if (persons.find(person => person.name === body.name)) {
    return response.status(409).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id:Math.floor(Math.random()*1000000000000)
  }
  persons = persons.concat(person)
  response.json(person)
})
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if(person) {
    response.json(person)
  }else{
    response.status(404).end()
  }
})

app.delete('/api/persons/:id',(request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})
