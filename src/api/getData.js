import fetch from '../config/fetch'

export const login = data => fetch('auth/login', data, 'POST');
