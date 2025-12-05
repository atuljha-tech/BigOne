'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrganizerRegistration() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    
    // Step 2: Business Details
    businessName: '',
    businessType: 'individual',
    taxId: '',
    businessAddress: '',
    city: '',
    state: '',
    website: '',
    businessRegistrationNumber: '',
    
    // Step 3: Verification Documents
    identificationProof: null,
    businessProof: null,
    termsAccepted: false
  });

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('=== DEBUG: Form submission ===');
    console.log('API endpoint should be: /api/register/organizer');
    
    if (loading) {
      console.log('Already submitting, please wait...');
      return;
    }
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    // Validate terms accepted
    if (!formData.termsAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      console.log('📤 Submitting organizer registration...');
      
      const response = await fetch('/api/register/organiser', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          organizerProfile: {
            fullName: formData.fullName,
            businessName: formData.businessName,
            businessType: formData.businessType,
            taxId: formData.taxId || '',
            businessAddress: formData.businessAddress || '',
            city: formData.city || '',
            state: formData.state || '',
            phone: formData.phone || '',
            website: formData.website || '',
            businessRegistrationNumber: formData.businessRegistrationNumber || ''
          }
        })
      });

      console.log('📥 Response status:', response.status);
      
      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (response.ok) {
        alert('✅ Registration successful! Your account is pending verification.');
        router.push('/auth/login?message=Registration+submitted+for+verification');
      } else {
        alert(`❌ Registration failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('🔥 Registration error:', error);
      alert(`❌ Error: ${error.message}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  const businessTypes = [
    { value: 'individual', label: 'Individual/Freelancer' },
    { value: 'company', label: 'Private Limited Company' },
    { value: 'llp', label: 'LLP (Limited Liability Partnership)' },
    { value: 'ngo', label: 'NGO/Trust/Society' },
    { value: 'educational', label: 'Educational Institution' },
    { value: 'government', label: 'Government Organization' },
    { value: 'other', label: 'Other' }
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && step < 3) {
      e.preventDefault();
      if (step === 1 || step === 2) {
        handleNext();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8" onKeyDown={handleKeyDown}>
      <div className="max-w-5xl mx-auto">
        {/* Header with background pattern */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
          <div className="relative px-8 py-12 text-center">
            <Link href="/auth/register" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Role Selection
            </Link>
            <h1 className="text-4xl font-bold text-white mb-4">Organizer Registration</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Join thousands of event organizers who trust our platform. Get verified and start creating amazing experiences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Progress Steps */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Registration Progress</h2>
              
              {/* Progress Steps with icons */}
              <div className="space-y-8">
                {[
                  { number: 1, title: 'Basic Information', description: 'Personal details & contact' },
                  { number: 2, title: 'Business Details', description: 'Company information' },
                  { number: 3, title: 'Verification', description: 'Document upload' }
                ].map((item) => (
                  <div key={item.number} className="flex items-start space-x-4">
                    <div className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      step === item.number 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-200' 
                        : step > item.number 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step > item.number ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-lg font-semibold">{item.number}</span>
                      )}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${step >= item.number ? 'text-gray-900' : 'text-gray-500'}`}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-10 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{step}/3 Steps</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                  />
                </div>
              </div>

              {/* Help Card */}
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">Need Help?</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Contact our support team for assistance with registration or verification.
                </p>
                <button className="mt-3 text-sm text-blue-600 font-medium hover:text-blue-700">
                  Contact Support →
                </button>
              </div>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Form Header with step indicator */}
              <div className="border-b border-gray-100">
                <div className="px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {step === 1 && 'Basic Information'}
                        {step === 2 && 'Business Details'}
                        {step === 3 && 'Document Verification'}
                      </h2>
                      <p className="text-gray-500 mt-1">
                        {step === 1 && 'Tell us about yourself'}
                        {step === 2 && 'About your business'}
                        {step === 3 && 'Upload required documents'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full">
                      <span className="text-sm font-semibold text-blue-700">Step {step} of 3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                {step === 3 ? (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Verification Info Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-blue-900">Verification Required</h3>
                          <p className="text-blue-700 mt-1">
                            To ensure platform security and prevent fake events, we verify all organizers.
                            Your account will be activated within 24-48 hours after document review.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Document Upload Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* ID Proof */}
                      <div className="space-y-4">
                        <label className="block">
                          <span className="text-lg font-semibold text-gray-900">Government ID Proof *</span>
                          <span className="text-sm text-gray-500 block mt-1">PAN Card, Aadhaar, or Passport</span>
                        </label>
                        <div className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 hover:border-blue-400 hover:shadow-lg ${
                          formData.identificationProof ? 'border-green-300 bg-green-50' : 'border-gray-300'
                        }`}>
                          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            id="idProof"
                            onChange={(e) => setFormData({...formData, identificationProof: e.target.files[0]})}
                          />
                          <label htmlFor="idProof" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-full hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all shadow-md hover:shadow-lg">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Choose File
                          </label>
                          {formData.identificationProof && (
                            <div className="mt-4 inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="font-medium">{formData.identificationProof.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Business Proof */}
                      <div className="space-y-4">
                        <label className="block">
                          <span className="text-lg font-semibold text-gray-900">Business Proof *</span>
                          <span className="text-sm text-gray-500 block mt-1">Certificate, GST, or Trade License</span>
                        </label>
                        <div className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 hover:border-blue-400 hover:shadow-lg ${
                          formData.businessProof ? 'border-green-300 bg-green-50' : 'border-gray-300'
                        }`}>
                          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                            <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            id="businessProof"
                            onChange={(e) => setFormData({...formData, businessProof: e.target.files[0]})}
                          />
                          <label htmlFor="businessProof" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:from-purple-600 hover:to-pink-600 cursor-pointer transition-all shadow-md hover:shadow-lg">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Choose File
                          </label>
                          {formData.businessProof && (
                            <div className="mt-4 inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="font-medium">{formData.businessProof.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <label className="flex items-start space-x-4 cursor-pointer">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                          formData.termsAccepted 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-transparent' 
                            : 'border-gray-300'
                        }`}>
                          {formData.termsAccepted && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          required
                          className="hidden"
                          checked={formData.termsAccepted}
                          onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                        />
                        <span className="text-gray-700">
                          I agree to the{' '}
                          <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                            Terms & Conditions
                          </Link>{' '}
                          and confirm that all information provided is accurate. I understand that
                          fake information may lead to account suspension and legal action.
                        </span>
                      </label>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-8 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-8 py-3 text-gray-700 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all"
                      >
                        ← Back
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-8 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                          loading 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 cursor-not-allowed opacity-90' 
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl'
                        } text-white`}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            Submit for Verification
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Steps 1 and 2 */
                  <div>
                    {step === 1 && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Form Fields with enhanced styling */}
                          {[
                            {
                              label: 'Full Name *',
                              type: 'text',
                              value: formData.fullName,
                              onChange: (e) => setFormData({...formData, fullName: e.target.value}),
                              placeholder: 'Your full legal name',
                              icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                            },
                            {
                              label: 'Email Address *',
                              type: 'email',
                              value: formData.email,
                              onChange: (e) => setFormData({...formData, email: e.target.value}),
                              placeholder: 'business@example.com',
                              icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                            },
                            {
                              label: 'Phone Number *',
                              type: 'tel',
                              value: formData.phone,
                              onChange: (e) => setFormData({...formData, phone: e.target.value}),
                              placeholder: '+91 9876543210',
                              icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                            },
                            {
                              label: 'Password *',
                              type: 'password',
                              value: formData.password,
                              onChange: (e) => setFormData({...formData, password: e.target.value}),
                              placeholder: 'Minimum 8 characters',
                              icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                            }
                          ].map((field, index) => (
                            <div key={index} className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                {field.label}
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
                                  </svg>
                                </div>
                                <input
                                  type={field.type}
                                  required
                                  minLength={field.type === 'password' ? 8 : undefined}
                                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder={field.placeholder}
                                />
                              </div>
                            </div>
                          ))}

                          {/* Confirm Password - Full width */}
                          <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Confirm Password *
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                              <input
                                type="password"
                                required
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                placeholder="Re-enter your password"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            {
                              label: 'Business/Organization Name *',
                              type: 'text',
                              value: formData.businessName,
                              onChange: (e) => setFormData({...formData, businessName: e.target.value}),
                              placeholder: 'Official business name'
                            },
                            {
                              label: 'Business Type *',
                              type: 'select',
                              options: businessTypes,
                              value: formData.businessType,
                              onChange: (e) => setFormData({...formData, businessType: e.target.value})
                            },
                            {
                              label: 'Tax ID (GST/PAN) *',
                              type: 'text',
                              value: formData.taxId,
                              onChange: (e) => setFormData({...formData, taxId: e.target.value}),
                              placeholder: 'GSTIN or PAN number'
                            },
                            {
                              label: 'Business Registration Number',
                              type: 'text',
                              value: formData.businessRegistrationNumber,
                              onChange: (e) => setFormData({...formData, businessRegistrationNumber: e.target.value}),
                              placeholder: 'CIN, LLPIN, etc.'
                            },
                            {
                              label: 'City *',
                              type: 'text',
                              value: formData.city,
                              onChange: (e) => setFormData({...formData, city: e.target.value}),
                              placeholder: 'City'
                            },
                            {
                              label: 'State *',
                              type: 'text',
                              value: formData.state,
                              onChange: (e) => setFormData({...formData, state: e.target.value}),
                              placeholder: 'State'
                            }
                          ].map((field, index) => (
                            <div key={index} className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                {field.label}
                              </label>
                              {field.type === 'select' ? (
                                <select
                                  required
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                                  value={field.value}
                                  onChange={field.onChange}
                                >
                                  {field.options.map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={field.type}
                                  required={field.label.includes('*')}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder={field.placeholder}
                                />
                              )}
                            </div>
                          ))}

                          {/* Full width fields */}
                          <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Business Address *
                            </label>
                            <textarea
                              rows={3}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              value={formData.businessAddress}
                              onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                              placeholder="Complete business address"
                            />
                          </div>

                          <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Website (Optional)
                            </label>
                            <input
                              type="url"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              value={formData.website}
                              onChange={(e) => setFormData({...formData, website: e.target.value})}
                              placeholder="https://yourbusiness.com"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons for Steps 1 and 2 */}
                    <div className="flex justify-between pt-8 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={handleBack}
                        disabled={step === 1}
                        className={`px-8 py-3 rounded-xl font-medium transition-all ${
                          step === 1 
                            ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                            : 'text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        ← Back
                      </button>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Continue to {step === 1 ? 'Business Details' : 'Verification'} →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Links */}
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                  Sign In
                </Link>
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Want to attend events instead?{' '}
                <Link href="/auth/register/user" className="text-purple-600 font-semibold hover:text-purple-700 hover:underline">
                  Register as User
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}