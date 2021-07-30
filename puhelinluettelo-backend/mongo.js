const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('password missing')
    process.exit(1)
}

const password = process.argv[2]

const dbUrl = `mongodb+srv://puhelinluettelo-rw:${password}@cluster0.pesdi.mongodb.net/phonebook1?retryWrites=true&w=majority`

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length == 3) {

    console.log('phonebook:')

    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })

} else if (process.argv.length == 5) {
    
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} in phonebook`);
        mongoose.connection.close()
    })

} else {

    console.log('Input the right amount of arguments')
    mongoose.connection.close()

}