const express = require('express')
const app = express()
app.use(express.json())

let persons = [
	{
		id: 1,
		name: "Matti Meikäläinen",
		number: "1234-1234"
	},
	{
		id: 2,
		name: "Eero Esimerkki",
		number: "1234-5678"
	},
	{
		id: 3,
		name: "Maija Mallikas",
		number: "9876-1234"
	}
]

const logReq = (req, res) => {
	console.log(`${req.method} ${req.url} ${res.statusCode} ${res.statusMessage}`)
}

app.get('/api/persons', (req, res) => {
	res.json(persons)
	logReq(req, res)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
})
