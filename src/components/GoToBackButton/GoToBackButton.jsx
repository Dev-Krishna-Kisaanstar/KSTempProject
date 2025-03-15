import React from 'react'
import { Link } from 'react-router-dom'

const GoToBackButton = ({links}) => {
  return (
    <Link className='btn btn-primary' to={links}>Back</Link>
  )
}

export default GoToBackButton