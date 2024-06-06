require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))

app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

// let persons = [
//   {
//     "id": 1,
//     "name": "Arto Hellas",
//     "number": "040-123456",
//   },
//   {
//     "id": 2,
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523",
//   },
//   {
//     "id": 3,
//     "name": "Dan Abramov",
//     "number": "12-43-234345",
//   },
//   {
//     "id": 4,
//     "name": "Mary Poppendick",
//     "number": "39-23-6423122"
//   }
// ]

app.get('/', (request, response) => {
  response.send('<h1>Puhelinluettelo</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const time = new Date()
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${time}</p>`)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.json(result)
      console.log(result)
      response.status(204).end()
    }
  )
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  console.log(body)

  if (!body.name | !body.number) {
    return response.status(400).json({
        error: 'include both name and number'
    })
  }

  // if (persons.some((item) => item.name === body.name)) {
  //   return response.status(400).json({
  //       error: 'name must be unique'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})