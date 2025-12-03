'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterRoleSelector() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole === 'organizer') {
      router.push('/auth/register/organizer');
    } else if (selectedRole === 'user') {
      router.push('/auth/register/user');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join TicketFlow
          </h1>
          <p className="text-gray-600 text-lg">
            Select your role to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Organizer Card */}
          <div 
            className={`bg-white rounded-2xl shadow-xl p-8 border-2 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 ${
              selectedRole === 'organizer' 
                ? 'border-blue-500 ring-4 ring-blue-100' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleRoleSelect('organizer')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Event Organizer</h2>
              
              <div className="mb-6">
                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                  Sell Tickets & Manage Events
                </span>
              </div>
              
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create custom seat layouts with drawing tool</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Track sales with detailed analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Get paid directly to your bank account</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Manage multiple events simultaneously</span>
                </li>
              </ul>
              
              <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-700 mb-1">Verification Required:</p>
                <p>Organizers must provide business details for verification to prevent fake events.</p>
              </div>
            </div>
          </div>

          {/* User Card */}
          <div 
            className={`bg-white rounded-2xl shadow-xl p-8 border-2 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 ${
              selectedRole === 'user' 
                ? 'border-purple-500 ring-4 ring-purple-100' 
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => handleRoleSelect('user')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Event Goer</h2>
              
              <div className="mb-6">
                <span className="inline-block px-4 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full mb-4">
                  Discover & Book Events
                </span>
              </div>
              
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Browse events by city, category, and date</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Interactive seat selection like BookMyShow</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Secure payments with multiple options</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Digital tickets and booking history</span>
                </li>
              </ul>
              
              <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-700 mb-1">Quick Registration:</p>
                <p>Get started instantly with just email and password. No verification needed.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-12 py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${
              selectedRole
                ? selectedRole === 'organizer'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedRole 
              ? `Continue as ${selectedRole === 'organizer' ? 'Organizer' : 'User'}` 
              : 'Select a Role to Continue'}
          </button>
          
          <p className="mt-6 text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}