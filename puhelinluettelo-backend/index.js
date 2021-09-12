require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('person', (req, res) => {
	if (req.method === 'POST') {
		return JSON.stringify(req.body)
	}
	return ' '
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.get('/api/info', (req, res) => {
	res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
	Person.find({}).then(person => res.json(person))
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
		.then(result => {
			res.status(204).end()
		}).catch(error => next(error))
})

app.post('/api/persons/', (req, res, next) => {

	const newPerson = { ...req.body }

	if (!newPerson.name) {
		next({ name:'MissingInfoError', message: 'name is missing' })
	} else if (!newPerson.number) {
		next({ name:'MissingInfoError', message: 'number is missing' })
	} /*else if (persons.find(person => person.name.toLowerCase() === newPerson.name.toLowerCase())) {
		res.status(409).json({ error: 'name must be unique' })
	} */else {
		new Person(newPerson).save().then(person => {
			res.json(person)
		})
	}
})

const errorHandler = (err, req, res, next) => {
	console.error(err.message)

	if(err.name === 'CastError') {
		return res.status(400).send({error: 'malformatted id'})
	} else if (err.name === 'MissingInfoError') {
		return res.status(400).send({error: err.message})
	}

	next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
})
