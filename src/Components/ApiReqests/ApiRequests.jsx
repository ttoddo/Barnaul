const api = "https://bgitusec.online"
const settings = {
  method : 'POST',
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json'
  }
}



export const editUser = async function (id, username, email, password, token){
    let editUserSettings = JSON.parse(JSON.stringify(settings))
    editUserSettings.method = 'PUT'
    editUserSettings.headers['Authorization'] = 'Bearer ' + token
    editUserSettings.body = JSON.stringify(
        {
            username: username,
            email: email, 
            password: password
        }
    )
    try {
        const res = await fetch(api + '/profile/' + id, editUserSettings)
        if (res.ok){
            console.log('Edit Success')
            return true
        } else {
            console.log('Edit Error')
            return false
        }

    } catch {
        console.log('Edit Error')
        return false
    }
}

export const removeUser = async function (id, token) {
    let removeUserSettings = JSON.parse(JSON.stringify(settings))
    removeUserSettings.method = 'DELETE'
    removeUserSettings.headers['Authorization'] = 'Bearer ' + token
    try{
        const res = await fetch(api + '/profile/delete/' + id, removeUserSettings)
        if (res.ok){
            console.log('Remove Success')
            return true
        } else{
            console.log('Remove Error')
            return false
        }
    } catch{
        console.log('Remvoe Error')
        return false
    }
}

export const getUser = async function (email, password){
    let getUserSettings = JSON.parse(JSON.stringify(settings))
    getUserSettings.body = JSON.stringify(
        {username: email,
        password: password})
    try {
      const res = await fetch(api + '/auth/sign-in', getUserSettings)
      const data = await res.json()
      console.log('SignIn Success')
      localStorage.setItem('TOKEN', data.token)
      return true
    } catch {
      console.log("SignIn Error")
      return false
    }
}

export const addUser = async function (username, email, password, role, token) {
    let addUserSettings = JSON.parse(JSON.stringify(settings))
    addUserSettings.method = 'POST'
    addUserSettings.headers['Authorization'] = 'Bearer ' + token
    addUserSettings.body = JSON.stringify(
        {
            username: username,
            email: email,
            password: password,
            role: role
        }
    )
    try{    
        const res = await fetch(api + '/auth/sign-up', addUserSettings)
        const data = await res.json()
        console.log('AddUser Success')
        return data
    } catch {
        console.log('AddUser Error')
        return false
    }
}

export const userInfo = async function (token) {
    let userInfoSettings = JSON.parse(JSON.stringify(settings))
    userInfoSettings.method = 'GET'
    userInfoSettings.headers['Authorization'] = 'Bearer ' + token
    try {
      const res = await fetch(api + '/profile', userInfoSettings)
      const data = await res.json()
      if (data.id){
        return data
      } else return false
    } catch{
      return false
    }
} 

export const getBreakdowns = async function (token){
    let breakdownsSettings = JSON.parse(JSON.stringify(settings))
    breakdownsSettings.method = 'GET'
    breakdownsSettings.headers['Authorization'] = 'Bearer ' + token
    try {
        const res = await fetch(api + '/breakdown/get-all', breakdownsSettings)
        const data = await res.json()
        if (data.breakdowns[0]){
            console.log('Breakdowns Seek Success')
            return data
        } else{
            console.log('Breakdowns Error')
            return false
        }
    } catch {
        console.log('Breakdowns Error')
        return false
    }

}

export const validate = async function (token){
    let validateSettings = JSON.parse(JSON.stringify(settings))
    validateSettings.method = 'GET'
    validateSettings.headers['Authorization'] = 'Bearer ' + token
    try {
        const res = await fetch(api + '/auth/valid', validateSettings)
        const data = await res.json()
        if (data.isValid){
            console.log('Validate Success')
            return true
        } else{
            console.log('Validate Error')
            return false
        }
    } catch {
        console.log('Validate Error')
        return false
    }
}

export const getUsers = async function (token) {
    let getUsersSettings = JSON.parse(JSON.stringify(settings))
    getUsersSettings.method = 'GET'
    getUsersSettings.headers['Authorization'] = 'Bearer ' + token
    try {
      const res = await fetch(api + '/profile/get-all', getUsersSettings)
      const data = await res.json()
      if (data.users[0]){
          console.log('GetUsers Success')
          return data
      } else{
          console.log('GetUsers Error')
          return false
      }
  } catch {
      console.log('GetUsers Error')
      return false
  }
}



export const logOut = function (){
    localStorage.removeItem('TOKEN')
    window.location.reload()
    console.log('LogOut Success')
    return
}
