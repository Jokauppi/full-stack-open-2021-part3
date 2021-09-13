const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const dbUrl = process.env.MONGODB_URI

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('database connected');
    })
    .catch((error) => {
        console.log('database connection failed\n' + error);
    })

const personSchema = new mongoose.Schema({
    name: {type: String,
        minLength: [3, 'Name must be at least 3 letters long'],
        unique: [true, 'Name already exists in the phonebook'],
        required: [true, 'Name is missing']
    },
    number: {type: String,
        minLength: [8, 'Name must be at least 8 digits long'],
        required: [true, 'Number is missing']
    }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personSchema)