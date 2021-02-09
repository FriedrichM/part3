import React from 'react'



const Notification = ({ message ,error}) => {
  
  if (message === null||message==="") {
    return null
  }

  if(error){
    return (
      <div className="error">
      {message}
      </div>
    )
  }else{
    return (
      <div className="good">
      {message}
      </div>
    )
  }
}

export default Notification
