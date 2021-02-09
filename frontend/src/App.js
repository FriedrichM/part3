import React, { useState, useEffect } from 'react'
import PhoneList from './components/PhoneList'
import Searchbar from './components/Searchbar'
import Notification from './components/Notification'
import AddForm from './components/AddForm'
import service from './services/persons'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ search, setSearch ] = useState('')
  const [ errorMessage, setErrorMessage] = useState('')
  const [ error, setError] = useState('')

  useEffect(() => {
      service.getAll().then(response => setPersons(response))
    }, [])

  const onSearchInputChange =(event)=>{
      setSearch(event.target.value)
  }

  const filteredPersons = search===''? [...persons]: persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))

  const showmessage = (message,error)=>{
    setErrorMessage(message)
    setError(error)
    setTimeout(() => {setErrorMessage(null)}, 5000)
  }


  const addNote =(event) =>{
      event.preventDefault()
      const existing = persons.filter(person => person.name === newName)
      if(existing.length===0){
        const newEntry = {
          name: newName,
          number: newNumber,
          id:persons.length+1
        }
        service.create(newEntry)
        .then(response => {
          setPersons(persons.concat(response))
          showmessage(`${response.name} added`,false)
        })
      }else{
        const oldentry= existing[0]
        if(window.confirm(`${oldentry.name} is already added to the phonebook, replace the old number with a new one?`)){
          const newEntry = {...oldentry,
            number:newNumber
          }
          service.update(oldentry.id,newEntry)
          .then(response => {
            setPersons(persons.map(person => person.id !== oldentry.id ? person : response))
            showmessage(`${response.name} updated`,false)
          }).catch(error => {
          showmessage( `${oldentry.name} was already removed from server`,true)
          setPersons(persons.filter(person=> person.id!==oldentry.id))
        })
        }
      }
  }
  const deletEntry =(entry) =>{
    if(window.confirm(`Do you want to delete ${entry.name}?`)){
      service.deleteEntry(entry.id)
      .then(response => {
        setPersons(persons.filter(person=> person.id!==entry.id))
        showmessage(`${entry.name} deleted`,false)
      })
    }

  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={errorMessage} error={error}/>
      <Searchbar barvalue={search} handler={onSearchInputChange}/>
      <h2>Add a new one</h2>
      <AddForm namechangeHandler={(event)=>setNewName(event.target.value)} numberchangeHandler={(event)=>setNewNumber(event.target.value)} nameValue={newName} numbervalue={newNumber} submitHandler={addNote} />
      <h2>Numbers</h2>
      <PhoneList entries={filteredPersons} deletehandler={deletEntry}/>
    </div>
  )
}

export default App
