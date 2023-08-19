const TokenKey = 'bjxchw_oa_token'
const RoleKey = 'bjxchw_oa_role'
const UserInfoKey = 'bjxchw_oa_info'

export function getToken() {``
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  sessionStorage.removeItem(TokenKey)
}

export function getRole() {
  let role = sessionStorage.getItem(RoleKey)
  if (role) {
    role = JSON.parse(role)
  }
  return role
}

export function getUserInfo() {
  let userInfo = sessionStorage.getItem(UserInfoKey)
  return userInfo ? JSON.parse(userInfo) : {}
}

export function setUserinfo(info) {
  sessionStorage.setItem(UserInfoKey, JSON.stringify(info))
}

export function setRole(role) {
  sessionStorage.setItem(RoleKey, role)
}

export function cleanUserInfo() {
  sessionStorage.clear()
}
