import React from 'react'

const Searchbar = ({handler, barvalue}) =>(
  <>
  <input value={barvalue} onChange={handler}/>
  </>
)
export default Searchbar
