const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]


const url =
  `mongodb+srv://fullstack:${password}@cluster0.crue7.mongodb.net/person?retryWrites=true&w=majority`


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  id: Number,
  number: String,
})

const Note = mongoose.model('Person', personSchema)



if(process.argv.length <5){
  Note.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(note => {
      console.log(`${note.name} ${note.number}`)
    })
    mongoose.connection.close()
  })
}else{
  const name = process.argv[3]
  const number = process.argv[4]
  const note = new Note({
    name: name,
    id: Math.floor(Math.random()*1000000000000),
    number: number,
  })
  note.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
