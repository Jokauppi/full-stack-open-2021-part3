const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


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

let persons = [
	{
		id: 1,
		name: 'Matti Meikäläinen',
		number: '1234-1234'
	},
	{
		id: 2,
		name: 'Eero Esimerkki',
		number: '1234-5678'
	},
	{
		id: 3,
		name: 'Maija Mallikas',
		number: '9876-1234'
	}
]

app.get('/api/info', (req, res) => {
	res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(person => person.id === id)
	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(person => person.id !== id)
	res.status(204).end()
})

app.post('/api/persons/', (req, res) => {

	const newPerson = { ...req.body }

	if (!newPerson.name) {
		res.status(400).json({ error: 'name is missing' })
	} else if (!newPerson.number) {
		res.status(400).json({ error: 'number is missing' })
	} else if (persons.find(person => person.name.toLowerCase() === newPerson.name.toLowerCase())) {
		res.status(409).json({ error: 'name must be unique' })
	} else {
		newPerson.id = Math.floor(Math.random() * 1000000000000000) + 1
		persons = persons.concat(newPerson)

		res.json(newPerson)
	}
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
})
