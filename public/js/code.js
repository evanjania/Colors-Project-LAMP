const urlBase = 'http://colorprojectevanjania.xyz/LAMPAPI'
const extension = 'php'
let userId = 0
let firstName = ''
let lastName = ''

// eslint-disable-next-line no-unused-vars
function doLogin () {
  userId = 0
  firstName = ''
  lastName = ''
  const login = document.getElementById('login-name').value
  const password = document.getElementById('login-password').value
  document.getElementById('login-result').innerHTML = ''
  const tmp = { login, password }
  const jsonPayload = JSON.stringify(tmp)
  const url = urlBase + '/Login.' + extension
  makeRequest(url, jsonPayload, 'login-result', function (response) {
    const jsonObject = JSON.parse(response)
    userId = jsonObject.id
    if (userId < 1) {
      document.getElementById('login-result').innerHTML = 'User/Password combination incorrect'
      return
    }
    firstName = jsonObject.firstName
    lastName = jsonObject.lastName
    saveCookie()
    window.location.href = 'color.html'
  })
}

function saveCookie () {
  const minutes = 20
  const date = new Date()
  date.setTime(date.getTime() + (minutes * 60 * 1000))
  document.cookie = 'firstName=' + firstName + ',lastName=' + lastName + ',userId=' + userId + ';expires=' + date.toGMTString()
}

// eslint-disable-next-line no-unused-vars
function readCookie () {
  userId = -1
  const data = document.cookie
  const splits = data.split(',')
  for (let i = 0; i < splits.length; i++) {
    const thisOne = splits[i].trim()
    const tokens = thisOne.split('=')
    if (tokens[0] === 'firstName') {
      firstName = tokens[1]
    } else if (tokens[0] === 'lastName') {
      lastName = tokens[1]
    } else if (tokens[0] === 'userId') {
      userId = parseInt(tokens[1].trim())
    }
  }
  if (userId < 0) {
    window.location.href = 'index.html'
  }
}

// eslint-disable-next-line no-unused-vars
function doLogout () {
  userId = 0
  firstName = ''
  lastName = ''
  document.cookie = 'firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  window.location.href = 'index.html'
}

function makeRequest (url, payload, resultElementId, successCallback) {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        successCallback(xhr.responseText)
      }
    }
    xhr.send(payload)
  } catch (err) {
    document.getElementById(resultElementId).innerHTML = err.message
  }
}

// eslint-disable-next-line no-unused-vars
function addColor () {
  const newColor = document.getElementById('colorText').value
  document.getElementById('colorAddResult').innerHTML = ''
  const tmp = { color: newColor, userId }
  const jsonPayload = JSON.stringify(tmp)
  const url = urlBase + '/AddColor.' + extension
  makeRequest(url, jsonPayload, 'colorAddResult', function (response) {
    document.getElementById('colorAddResult').innerHTML = 'Color has been added'
  })
}

// eslint-disable-next-line no-unused-vars
function searchColor () {
  const srch = document.getElementById('searchText').value
  document.getElementById('colorSearchResult').innerHTML = ''
  const tmp = { search: srch, userId }
  const jsonPayload = JSON.stringify(tmp)
  const url = urlBase + '/SearchColors.' + extension
  makeRequest(url, jsonPayload, 'colorSearchResult', function (response) {
    document.getElementById('colorSearchResult').innerHTML = 'Color(s) has been retrieved'
    const jsonObject = JSON.parse(response)
    let colorList = ''
    for (let i = 0; i < jsonObject.results.length; i++) {
      colorList += jsonObject.results[i]
      if (i < jsonObject.results.length - 1) {
        colorList += '<br />\r\n'
      }
    }
    document.getElementsByTagName('p')[0].innerHTML = colorList
  })
}
