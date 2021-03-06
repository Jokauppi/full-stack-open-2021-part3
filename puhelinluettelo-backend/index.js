require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('person', (req) => {
	if (req.method === 'POST') {
		return JSON.stringify(req.body)
	}
	return ' '
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.get('/api/info', (req, res) => {
	Person.find({}).then(persons => {
		res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
	})
})

app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons => res.json(persons))
})

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then(person => {
			if (person) {
				res.json(person)
			} else {
				res.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(res.status(204).end())
		.catch(error => next(error))
})

app.post('/api/persons/', (req, res, next) => {

	const newPerson = { ...req.body }

	new Person(newPerson).save().then(person => {
		res.json(person)
	})
		.catch(error => {
			next(error)
		})
})

app.put('/api/persons/:id', (req, res, next) => {

	const updatedPerson = { ...req.body }

	Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true })
		.then(person => {
			res.json(person)
		})
		.catch(error => next(error))


})

const errorHandler = (err, req, res, next) => {
	console.error(err.message)

	if(err.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	} else if (err.name === 'MissingInfoError') {
		return res.status(400).send({ error: err.message })
	} else if (err.name === 'ValidationError') {
		return res.status(400).send({ error: err.errors[Object.keys(err.errors)[0]].properties.message })
	}

	next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`)
})
