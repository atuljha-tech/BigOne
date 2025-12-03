'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PendingVerification() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      const data = await res.json();
      setUser(data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Account Pending Verification
            </h1>
            <p className="text-gray-600 text-lg">
              Your organizer account is under review
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 mb-2">What's happening?</h3>
              <p className="text-blue-700">
                We're verifying your business details to ensure authenticity and prevent fake events. 
                This usually takes 24-48 hours.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Verification Status</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Registration Submitted</p>
                    <p className="text-sm text-gray-600">Your details have been received</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={`w-8 h-8 ${user?.organizerProfile?.verificationStatus === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mr-3`}>
                    {user?.organizerProfile?.verificationStatus === 'pending' ? (
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    ) : (
                      <span className="text-gray-400">2</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Document Verification</p>
                    <p className="text-sm text-gray-600">Reviewing your submitted documents</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-400">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-400">Account Activation</p>
                    <p className="text-sm text-gray-500">Start creating events after approval</p>
                  </div>
                </div>
              </div>
            </div>

            {user?.organizerProfile?.verificationStatus === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-semibold text-red-800 mb-2">Verification Rejected</h3>
                <p className="text-red-700">
                  {user.organizerProfile.verificationNotes || 
                    'Your documents could not be verified. Please contact support.'}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Contact Support
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Refresh Status
            </button>

            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/auth/login';
              }}
              className="px-6 py-3 text-gray-600 font-medium rounded-lg hover:text-gray-800 transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="text-center mt-8 pt-6 border-t">
            <p className="text-gray-600">
              Want to attend events while waiting?{' '}
              <Link href="/auth/register/user" className="text-purple-600 font-medium hover:underline">
                Register as User
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}