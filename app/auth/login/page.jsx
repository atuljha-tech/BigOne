'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Store token
        localStorage.setItem('token', data.token);
        
        // Redirect based on role
        if (data.user.role === 'organizer') {
          // Check if organizer is verified
          if (!data.user.organizerProfile?.isVerified) {
            router.push('/organizer/pending-verification');
          } else {
            router.push('/organizer/dashboard');
          }
        } else {
          router.push('/user/dashboard');
        }
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Message Alert */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{decodeURIComponent(message)}</p>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to TicketFlow?</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Link
                href="/auth/register/organizer"
                className="py-3 px-4 border border-blue-600 text-blue-600 text-center font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                Join as Organizer
              </Link>
              <Link
                href="/auth/register/user"
                className="py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Join as User
              </Link>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-medium text-gray-900 mb-2">Need help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Organizers: Contact support for verification issues
            </p>
            <Link 
              href="/contact" 
              className="inline-block px-6 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}