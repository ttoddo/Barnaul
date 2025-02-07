import React, { useState } from 'react'
import '../styles/Admin.css'
import UserInfo from './UI/UserInfo/UserInfo'

const AdminUsersInfo =function(props) {
    const [user] = useState([
        {id: 1, title: `User takoi-to`, role: `zaza`},
        {id: 2, title: `User takoi-to`, role: `zaza`},
        {id: 3, title: `User takoi-to`, role: `zaza`},
        {id: 4, title: `User takoi-to`, role: `zaza`},
        {id: 5, title: `User takoi-to`, role: `zaza`},
        {id: 6, title: `User takoi-to`, role: `zaza`},
        {id: 7, title: `User takoi-to`, role: `zaza`},
    ])


  return (
    <div className='adminUserInfo'>
        {user.map(user => 
            <UserInfo user={user}/>
        )}
        
    </div>
  )
}

export default AdminUsersInfo