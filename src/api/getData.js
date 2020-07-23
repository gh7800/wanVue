import fetch from '../config/fetch'

export const logins = data => fetch('/auth/login', data, 'POST');
