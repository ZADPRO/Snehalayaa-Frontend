import axios from 'axios'
import { baseURL } from '../../utils/helper'

export const loginPayload = (username: string, password: string) => ({
  Username: username,
  Password: password
})

export const handleLogin = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${baseURL}/admin/login`, loginPayload(username, password))
    const { data } = response.data

    if (data?.status) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('userDetails', JSON.stringify(data.user))
      return { success: true }
    } else {
      return { success: false, message: data?.message || 'Login failed' }
    }
  } catch (error) {
    return { success: false, message: 'Something went wrong during login.' }
  }
}
