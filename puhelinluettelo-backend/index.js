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
	} else {
		new Person(newPerson).save().then(person => {
			res.json(person)
		})
		.catch(error => {
			next(error)
		})
	}
})

app.put('/api/persons/:id', (req, res, next) => {

	const updatedPerson = { ...req.body }

	if (!updatedPerson.name) {
		next({ name:'MissingInfoError', message: 'name is missing' })
	} else if (!updatedPerson.number) {
		next({ name:'MissingInfoError', message: 'number is missing' })
	} else {
		Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true })
			.then(person => {
				res.json(person)
			})
			.catch(error => next(error))
	}

})

const errorHandler = (err, req, res, next) => {
	console.error(err.message)

	if(err.name === 'CastError') {
		return res.status(400).send({error: 'malformatted id'})
	} else if (err.name === 'MissingInfoError') {
		return res.status(400).send({error: err.message})
	} else if (err.name === 'ValidationError') {
		const type = err.errors.name.properties.type
		//const variable = err.errors.name.properties.path

		if (type === 'unique') {
			return res.status(409).send({error: 'Name must be unique'})
		} else {
			return res.status(400).send({error: err.message})
		}
	}

	next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
})
