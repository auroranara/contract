// import Cookies from 'js-cookie'
import Config from '@/settings'

const TokenKey = Config.TokenKey

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token, rememberMe) {
  if (rememberMe) {
    return sessionStorage.setItem(TokenKey, token)
  } else return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}
