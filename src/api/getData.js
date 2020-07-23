import fetch from '../config/fetch'

export const logins = data => fetch('/user/login', data, 'POST');
export const banner = () => fetch('/user/login', 'GET');
