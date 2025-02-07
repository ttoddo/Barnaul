import React, { useState } from 'react'
import '../styles/Profile.css'
import ErrorBlock from './UI/ErrorBlock/ErrorBlck'

const ProfileStatistic =function(props) {
    const [error, setError] = useState([
        {id: 1, title: `Error Name`, date: `21.21.2121`, username: `User Name`, status: `Solved`},
        {id: 2, title: `Error Name`, date: `21.21.2121`, username: `User Name`, status: `Solved`},
        {id: 3, title: `Error Name`, date: `21.21.2121`, username: `User Name`, status: `Solved`},
        {id: 4, title: `Error Name`, date: `21.21.2121`, username: `User Name`, status: `Solved`},
        {id: 5, title: `Error Name`, date: `21.21.2121`, username: `User Name`, status: `Solved`},
        {id: 6, title: `Error Name`, date: `21.21.2121`, username: `User Name`, status: `Solved`}

    ])


  return (
    <div className='profileStat'>
        {error.map(error => 
            <ErrorBlock error={error}/>
        )}
        
    </div>
  )
}

export default ProfileStatistic