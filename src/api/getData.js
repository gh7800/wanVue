import fetch from '@/config/fetch'

export const logins = data => fetch('/admin/login', data, 'POST');
