import React, { useEffect, useRef, useState } from 'react'
import './Login.css'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Password } from 'primereact/password'
import { useNavigate } from 'react-router-dom'

import { sendOtp, verifyOtp, resetPassword } from './ForgotPassword.function'
import LoginImage from '../../assets/login/loginImage.png'

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(45)
  const toast = useRef<Toast>(null)
  const navigate = useNavigate()

  // Timer for Resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [step, timer])

  const handleSendOtp = async () => {
    if (!email)
      return toast.current?.show({
        severity: 'warn',
        summary: 'Required',
        detail: 'Enter your email'
      })

    setIsLoading(true)
    const res = await sendOtp(email)
    setIsLoading(false)

    if (res.success) {
      toast.current?.show({ severity: 'success', summary: 'OTP Sent', detail: res.message })
      setStep(2)
      setTimer(45)
    } else {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: res.message })
    }
  }

  const handleVerifyOtp = async () => {
    const code = otp.join('')
    if (code.length !== 4) {
      return toast.current?.show({
        severity: 'warn',
        summary: 'Required',
        detail: 'Enter full OTP'
      })
    }

    setIsLoading(true)
    const res = await verifyOtp(email, code)
    setIsLoading(false)

    if (res.success) {
      toast.current?.show({ severity: 'success', summary: 'Verified', detail: res.message })
      setStep(3)
    } else {
      toast.current?.show({ severity: 'error', summary: 'Invalid OTP', detail: res.message })
    }
  }

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return toast.current?.show({
        severity: 'warn',
        summary: 'Mismatch',
        detail: 'Passwords do not match'
      })
    }

    setIsLoading(true)
    const res = await resetPassword(email, newPassword)
    setIsLoading(false)

    if (res.success) {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: res.message })

      // Reset state
      setStep(1)
      setEmail('')
      setOtp(['', '', '', ''])
      setNewPassword('')
      setConfirmPassword('')

      // Redirect to login
      setTimeout(() => {
        navigate('/login')
      }, 1000) // Optional small delay for user to see success message
    } else {
      toast.current?.show({ severity: 'error', summary: 'Failed', detail: res.message })
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 3) {
      const next = document.getElementById(`otp-${index + 1}`)
      next?.focus()
    }
  }

  const handleResend = () => {
    handleSendOtp()
  }
  return (
    <div className="loginComponent">
      <Toast ref={toast} position="top-right" />

      <div className="loginLeft">
        <img src={LoginImage} alt="ERP Forgot Password" className="loginImage" />
      </div>

      <div className="loginRight">
        <div className="loginForm">
          <h2 className="login-title">Forgot Password</h2>

          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <>
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full mb-3"
              />
              <Button
                label={isLoading ? 'Sending...' : 'Send OTP'}
                loading={isLoading}
                onClick={handleSendOtp}
                className="w-full forgotPasswordButton"
              />
            </>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <>
              <div className="flex gap-2 justify-content-center mb-3">
                {otp.map((digit, index) => (
                  <InputText
                    key={index}
                    id={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    maxLength={1}
                    className="text-center"
                    style={{ width: '3rem', fontSize: '1.5rem' }}
                  />
                ))}
              </div>

              <Button
                label={isLoading ? 'Verifying...' : 'Verify OTP'}
                loading={isLoading}
                onClick={handleVerifyOtp}
                className="w-full mb-2 forgotPasswordButton"
              />

              <div className="text-sm text-center">
                {timer > 0 ? (
                  <span>
                    Resend OTP in <strong>{timer}s</strong>
                  </span>
                ) : (
                  <Button
                    label="Resend OTP"
                    link
                    onClick={handleResend}
                    className="forgotPasswordButton"
                  />
                )}
              </div>

              <Button
                label="Back"
                className="mt-2 forgotPasswordButton"
                onClick={() => setStep(1)}
                outlined
              />
            </>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {step === 3 && (
            <>
              <Password
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                toggleMask
                feedback={false}
                className="w-full mb-3"
              />
              <Password
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                toggleMask
                feedback={false}
                className="w-full mb-3"
              />
              <Button
                label={isLoading ? 'Resetting...' : 'Reset Password'}
                loading={isLoading}
                onClick={handleResetPassword}
                className="w-full forgotPasswordButton"
              />
              <Button label="Back" className="mt-2" onClick={() => setStep(2)} outlined />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
