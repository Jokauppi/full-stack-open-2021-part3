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
    name: {type: String, unique: true},
    number: {type: String}
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