import axios from 'axios'
import { baseURL } from '../../utils/helper'

export const sendOtp = async (email: string) => {
  try {
    const res = await axios.post(`${baseURL}/admin/forgot-password`, { email })
    return { success: res.data.status, message: res.data.message }
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Failed to send OTP'
    }
  }
}

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const res = await axios.post(`${baseURL}/admin/verify-otp`, { email, otp })
    return { success: res.data.status, message: res.data.message }
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'OTP verification failed'
    }
  }
}

export const resetPassword = async (email: string, newPassword: string) => {
  try {
    const res = await axios.post(`${baseURL}/admin/reset-password`, { email, newPassword })
    return { success: res.data.status, message: res.data.message }
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Password reset failed'
    }
  }
}
