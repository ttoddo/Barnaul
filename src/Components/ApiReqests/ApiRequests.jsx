const api = "https://bgitu-fix.ru:7111/api"
const settings = {
  method: 'POST',
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json'
  }
}

const refreshUser = async function (token, refreshToken) {
    let getRefreshSettings = JSON.parse(JSON.stringify(settings))
    getRefreshSettings.headers['Authorization'] = 'Bearer ' + token
    getRefreshSettings.body = JSON.stringify({
        token: token,
        refreshToken: refreshToken
    })
    try {
        const res = await fetch(api + '/auth/refresh-token', getRefreshSettings)
        const data = await res.json()
        localStorage.setItem('TOKEN', data.token)
        localStorage.setItem('REFRESH_TOKEN', data.refreshToken)
        return res
    } catch {
        console.log("Refresh Error")
        return "BadRefresh"
    }
}

const request = async function ( route, settings ) {
    let res = await fetch(route, settings)
    if (res.status === 200 || res.status === 201 || res.status === 204){
        return res
    } else {
        const refreshRes = await refreshUser(localStorage.getItem("TOKEN"), localStorage.getItem("REFRESH_TOKEN"))
        if (refreshRes.status === 200 || refreshRes.status === 201 || refreshRes.status === 204){
            settings.headers['Authorization'] = 'Bearer ' + localStorage.getItem("TOKEN")
            res = await fetch(route, settings)
            if (res.status === 200 || res.status === 201 || res.status === 204){
                return res
            } else if (res.status === 400 || res.status === 401 || res.status === 204){
                console.log("Проблема с JWT")
                return false
            } else return false
        } else return false
    }
}

export const getUser = async function (email, password){
    let getUserSettings = JSON.parse(JSON.stringify(settings))
    getUserSettings.body = JSON.stringify(
        {name: email,
        password: password})
    
    let route = api + '/auth/sign-in'
    const res = await request(route, getUserSettings)

    if (res){
        const data = await res.json()
        console.log('SignIn Success')
        localStorage.setItem('TOKEN', data.token)
        localStorage.setItem('REFRESH_TOKEN', data.refreshToken)
        return true
    } else {
        console.log("SignIn Error")
        return false
    }
    
}

export const userInfo = async function (token) {
    let userInfoSettings = JSON.parse(JSON.stringify(settings))
    userInfoSettings.method = 'GET'
    userInfoSettings.headers['Authorization'] = 'Bearer ' + token

    let route = api + '/profile'
    const res = await request(route, userInfoSettings)
    
    if (res) {
        const data = await res.json()
        console.log("UserInfo Success")
        return data
    } else {
        console.log("UserInfo Error")
        return false
    }
} 

export const getAuds = async function (token) {
    let getAudsSettings = JSON.parse(JSON.stringify(settings))
    getAudsSettings.method = 'GET'
    getAudsSettings.headers['Authorization'] = 'Bearer ' + token

    let route = api + '/aud'
    const res = await request(route, getAudsSettings)

    if (res){
        const auds = await res.json()
            if (auds) {
            console.log('GetAuds Success')
            return auds
        } else {
            console.log('No Auds')
            return false
        }
    } else {
            console.log("GetAuds Error")
            return false
    }
}

export const getComputers = async function (token) {
    let getComputerSettings = JSON.parse(JSON.stringify(settings))
    getComputerSettings.method = 'GET'
    getComputerSettings.headers['Authorization'] = 'Bearer ' + token

    let route = api + '/computer'
    let res = await request(route, getComputerSettings)

    if (res) {
        let data = await res.json()
        console.log("GetComputers Success")
        return data
    } else {
        console.log("GetComputers Error")
        return false
    }
}

export const getBreakdowns = async function (token){
    let breakdownsSettings = JSON.parse(JSON.stringify(settings))
    breakdownsSettings.method = 'GET'
    breakdownsSettings.headers['Authorization'] = 'Bearer ' + token

    let route = api + '/breakdown'
    const res = await request(route, breakdownsSettings)
    
    if (res) {
        let data = await res.json()
        console.log("Breakdowns Seek Success")
        return data
    } else {
        console.log('Breakdowns Seek Error')
        return false
    }
}

export const addBreakdown = async function (token, info) {
    let addBreakdownSettings = JSON.parse(JSON.stringify(settings))
    addBreakdownSettings.method = 'POST'
    addBreakdownSettings.headers['Authorization'] = 'Bearer ' + token
    addBreakdownSettings.body = JSON.stringify(info)
    let route = api + '/breakdown'
    const res = await request(route, addBreakdownSettings)
    if (res) {
        console.log("Breakdown Add Success")
        return true
    } else {
        console.log('Breakdown Add Error')
        return false
    }
}

export const changeBreakdown = async function (token, id, status) {
    let changeBreakdownSettings = JSON.parse(JSON.stringify(settings))
    changeBreakdownSettings.method = 'PUT'
    changeBreakdownSettings.headers['Authorization'] = "Bearer " + token
    changeBreakdownSettings.body = JSON.stringify({isSolved: status})
    let route = api + '/breakdown/' + id
    const res = await request(route, changeBreakdownSettings)
    if (res) {
        console.log("Change Breakdown Success")
        return true
    } else {
        console.log('Change Breakdown Success')
        return false
    }
}

export const deleteBreakdown = async function (token, id) {
    let deleteBreakdownSettings = JSON.parse(JSON.stringify(settings))
    deleteBreakdownSettings.method = 'DELETE'
    deleteBreakdownSettings.headers['Authorization'] = "Bearer " + token
    let route = api + '/breakdown/' + id
    const res = await request(route, deleteBreakdownSettings)
    if (res) {
        console.log("Delete Breakdown Success")
        return true
    } else {
        console.log('Delete Breakdown Success')
        return false
    }
}

export const getUsers = async function (token) {
    let getUsersSettings = JSON.parse(JSON.stringify(settings))
    getUsersSettings.method = 'GET'
    getUsersSettings.headers['Authorization'] = 'Bearer ' + token
    let route = api + '/user'
    const res = await request(route, getUsersSettings)
    if (res) {
        let data = await res.json()
        console.log('GetUsers Success')
        return data
    } else{
        console.log('GetUsers Error')
        return false
    }
}

export const addUser = async function (username, email, password, role, token) {
    let addUserSettings = JSON.parse(JSON.stringify(settings))
    addUserSettings.method = 'POST'
    addUserSettings.headers['Authorization'] = 'Bearer ' + token
    addUserSettings.body = JSON.stringify(
        {
            name: username,
            email: email,
            password: password,
            role: role, 
            sentNotifications: false
        }
    )
    let route = api + '/auth/sign-up'
    const res = await request(route, addUserSettings)
    if (res) {    
        console.log('AddUser Success')
        return true
    } else {
        console.log('AddUser Error')
        return false
    }
}

export const removeUser = async function (id, token) {
    let removeUserSettings = JSON.parse(JSON.stringify(settings))
    removeUserSettings.method = 'DELETE'
    removeUserSettings.headers['Authorization'] = 'Bearer ' + token
    let route = api + '/user/' + id
    let res = await request(route, removeUserSettings)
    if (res){
        console.log('Remove Success')
        return true
    } else {
        console.log('Remove Error')
        return false
    }
}

export const logOut = function (){
    localStorage.removeItem('TOKEN')
    localStorage.removeItem('REFRESH_TOKEN')
    window.location.reload()
    console.log('LogOut Success')
    return
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
            let refreshRes = await refreshUser(localStorage.getItem())
            console.log(refreshRes)
            console.log('Edit Error')
            return false
        }

    } catch {
        console.log('Edit Error')
        return false
    }
}


