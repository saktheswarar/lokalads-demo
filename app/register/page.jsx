'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react' // ✅ Added to fix the error
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    phone: '',
    password: '',
    otpPhone: '',
    otpEmail: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpSentPhone, setOtpSentPhone] = useState(false)
  const [otpSentEmail, setOtpSentEmail] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value }))
  }

  const sendPhoneOtp = async () => {
    if (!formData.phone) return alert('Enter phone number first')
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP')
      setOtpSentPhone(true)
      alert('OTP sent via WhatsApp')
    } catch (err) {
      alert(err.message || 'Error sending WhatsApp OTP')
    }
  }

  const sendEmailOtp = async () => {
    if (!formData.email) return alert('Enter email first')
    try {
      const res = await fetch('/api/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP')
      setOtpSentEmail(true)
      alert('OTP sent to email')
    } catch (err) {
      alert(err.message || 'Error sending email OTP')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Registration failed')
      }
      alert('Registered successfully!')
      router.push('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-10 p-6">
      <CardContent>
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <Label>User Name</Label>
            <Input type="text" name="userName" required onChange={handleChange} />
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
              <Label>First Name</Label>
              <Input name="firstName" required onChange={handleChange} />
            </div>
            <div className="w-1/2">
              <Label>Last Name</Label>
              <Input name="lastName" required onChange={handleChange} />
            </div>
          </div>

          <div>
            <Label>Date of Birth</Label>
            <Input type="date" name="dob" required onChange={handleChange} />
          </div>

          <div>
            <Label>Email</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                name="email"
                required
                onChange={handleChange}
                className="flex-1"
              />
              <Button type="button" variant="default" onClick={sendEmailOtp}>
                Send OTP
              </Button>
            </div>
            {otpSentEmail && (
              <Input
                className="mt-2"
                name="otpEmail"
                placeholder="Enter Email OTP"
                onChange={handleChange}
              />
            )}
          </div>

          <div>
            <Label>Phone</Label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <PhoneInput
                  country={'in'}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputStyle={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '0.375rem',
                    border: '1px solid #ccc',
                    paddingLeft: '48px',
                  }}
                  buttonStyle={{
                    borderRadius: '0.375rem 0 0 0.375rem',
                    borderRight: '1px solid #ccc',
                  }}
                  containerStyle={{ width: '100%' }}
                />
              </div>
              <Button
                type="button"
                className="h-[42px]"
                variant="default"
                onClick={sendPhoneOtp}
              >
                Send OTP
              </Button>
            </div>
            {otpSentPhone && (
              <Input
                className="mt-2"
                name="otpPhone"
                placeholder="Enter Phone OTP"
                onChange={handleChange}
              />
            )}
          </div>

          <div className="relative">
            <Label>Password</Label>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              onChange={handleChange}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-9 right-3 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={() => signIn('google')} // ✅ Uses the imported function
          >
            <FaGoogle className="mr-2" /> Register with Google
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
