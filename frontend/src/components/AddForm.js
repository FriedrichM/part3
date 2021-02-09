import React from 'react'

const AddForm = ({namechangeHandler,numberchangeHandler,nameValue,numbervalue,submitHandler}) =>(
  <>
  <form onSubmit= {submitHandler}>
    <div>
      name: <input value={nameValue} onChange={namechangeHandler} /><br/>
      number: <input value={numbervalue} onChange={numberchangeHandler} />
    </div>
    <div>
      <button type="submit" >add</button>
    </div>
  </form>
  </>
)

export default AddForm
