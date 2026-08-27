const TokenKey = 'bjxchw_oa_token'
const TokenExpKey = 'bjxchw_oa_token_exp'
const RoleKey = 'bjxchw_oa_role'
const UserInfoKey = 'bjxchw_oa_info'

// 持久登录：token 默认有效期（天）。过期后 getToken 返回 null，由路由守卫/拦截器引导重新登录。
const TOKEN_EXPIRE_DAYS = 7

export function getToken() {
  const token = localStorage.getItem(TokenKey)
  if (!token) {
    return null
  }
  const exp = localStorage.getItem(TokenExpKey)
  if (exp && Number(exp) < Date.now()) {
    // 已过期，清理并返回 null（视为未登录）
    removeToken()
    return null
  }
  return token
}

export function setToken(token, expireDays = TOKEN_EXPIRE_DAYS) {
  localStorage.setItem(TokenKey, token)
  localStorage.setItem(TokenExpKey, String(Date.now() + expireDays * 24 * 60 * 60 * 1000))
}

export function removeToken() {
  localStorage.removeItem(TokenKey)
  localStorage.removeItem(TokenExpKey)
}

export function getRole() {
  let role = localStorage.getItem(RoleKey)
  if (role) {
    role = JSON.parse(role)
  }
  return role
}

export function getUserInfo() {
  try {
    let userInfo = localStorage.getItem(UserInfoKey)
    return userInfo ? JSON.parse(userInfo) : {}
  } catch (e) {
    return {}
  }
}

export function setUserinfo(info) {
  localStorage.setItem(UserInfoKey, JSON.stringify(info))
}

export function setRole(role) {
  localStorage.setItem(RoleKey, role)
}

export function cleanUserInfo() {
  localStorage.removeItem(TokenKey)
  localStorage.removeItem(TokenExpKey)
  localStorage.removeItem(RoleKey)
  localStorage.removeItem(UserInfoKey)
}
