import React from 'react'
import Entry from './Entry'


const PhoneList = ({entries,deletehandler}) =>(
  <>
  {entries.map(entry =>
    <div key={entry.id}>
    <Entry  entry={entry} />
    <button onClick={()=>deletehandler(entry)}>delete</button>
    </div>
  )}
  </>
)

export default PhoneList
