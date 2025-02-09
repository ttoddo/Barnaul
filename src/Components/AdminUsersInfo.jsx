import React, { useEffect, useState } from 'react'
import '../styles/Admin.css'
import UserInfo from './UI/UserInfo/UserInfo'
import { getUsers } from './ApiReqests/ApiRequests'

const AdminUsersInfo =function(props) {
    const [users, setUsersInfo] = useState([])
    const [finalUsers, setFinalUsers] = useState([])
    useEffect(() => {
      async function getUsersInfo(){
        var res = await getUsers(localStorage.getItem('TOKEN'))
        setUsersInfo(res.users)
      }
      getUsersInfo()
    }, [])
    function byId(a, b){
      return a.key - b.key;
    }

    if (users){
      if (users.length !== finalUsers.length) {
        var tempUsers = []
        for (var i=0; i < users.length; i++){
          var _role = ''
          switch (users[i].role){
            case 'ROLE_ADMIN':
              _role = 'Администартор'
              break;
            case 'ROLE_USER':
              _role = 'Пользователь'
              break;
            default:
              console.log('Backender needs to be punished.')
          }
          tempUsers = [...tempUsers, {key: users[i].id, title: users[i].username, role: _role}]
          
        }
        if (tempUsers.length > 1){
          tempUsers.sort(byId);
        }
        setFinalUsers(tempUsers)
      }
      return (
        <div className='adminUserInfo'>
            {finalUsers.map(user => 
                <UserInfo remove={props.remove} key={user.key} user={user}/>
            )}
        </div>
      )
    }
}

export default AdminUsersInfo