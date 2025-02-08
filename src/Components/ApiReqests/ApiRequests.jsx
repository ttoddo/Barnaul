const api = "https://bgitusec.online"
const settings = {
  method : 'POST',
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json'
  }
}



export const getUser = async function (email, password){
    var getUserSettings = JSON.parse(JSON.stringify(settings))
    getUserSettings.body = JSON.stringify(
        {username: email,
        password: password})
    console.log(getUserSettings)
    try {
      const res = await fetch(api + '/auth/sign-in', getUserSettings)
      const data = await res.json()
      console.log(data)
      console.log('SignIn Success')
      localStorage.setItem('TOKEN', data.token)
      return true
    } catch {
      console.log("SignIn Error")
      return false
    }
}

export const validate = async function (token){
    var validateSettings = JSON.parse(JSON.stringify(settings))
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

export const logOut = function (){
    localStorage.removeItem('TOKEN')
    console.log('LogOut Success')
    return
}
