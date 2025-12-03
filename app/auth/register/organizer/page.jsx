'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrganizerRegistration() {
  const router = useRouter();
  const [step, setStep] = useState(1);
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

  try {
    console.log('Submitting organizer registration...');
    
    // Fix: Use absolute URL for API calls in production
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? `${window.location.origin}/api/auth/register/organizer`
      : '/api/auth/register/organizer';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        role: 'organizer',
        organizerProfile: {
          fullName: formData.fullName,
          businessName: formData.businessName,
          businessType: formData.businessType,
          taxId: formData.taxId,
          businessAddress: formData.businessAddress,
          city: formData.city,
          state: formData.state,
          phone: formData.phone,
          website: formData.website,
          businessRegistrationNumber: formData.businessRegistrationNumber,
        }
      })
    });

    console.log('Response status:', response.status);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200));
      throw new Error('Server returned non-JSON response');
    }

    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      alert('Registration successful! Your account is pending verification.');
      router.push('/auth/login?message=Registration+submitted+for+verification');
    } else {
      alert(data.error || 'Registration failed: ' + response.statusText);
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert(`Registration error: ${error.message}. Check console for details.`);
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/auth/register" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Role Selection
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Organizer Registration</h1>
          <p className="text-gray-600 mt-2">Complete all steps to verify your business</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold mb-2 ${
                  step === stepNumber 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                    : step > stepNumber 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > stepNumber ? '✓' : stepNumber}
                </div>
                <span className={`text-sm font-medium ${
                  step >= stepNumber ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {stepNumber === 1 && 'Basic Info'}
                  {stepNumber === 2 && 'Business Details'}
                  {stepNumber === 3 && 'Verification'}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full mt-4">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(step - 1) * 50}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Your full legal name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="business@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Minimum 8 characters"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Re-enter your password"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business/Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    placeholder="Official business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                  >
                    {businessTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax ID (GST/PAN) *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.taxId}
                    onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                    placeholder="GSTIN or PAN number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Registration Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.businessRegistrationNumber}
                    onChange={(e) => setFormData({...formData, businessRegistrationNumber: e.target.value})}
                    placeholder="CIN, LLPIN, etc."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address *
                  </label>
                  <textarea
                    rows={3}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                    placeholder="Complete business address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    placeholder="State"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://yourbusiness.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Verification */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Verification Documents</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Verification Required</h3>
                <p className="text-blue-700">
                  To prevent fake events and ensure trust, we verify all organizers. 
                  Your account will be activated within 24-48 hours after document verification.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Government ID Proof *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600 mb-2">Upload PAN Card, Aadhaar, or Passport</p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="idProof"
                      onChange={(e) => setFormData({...formData, identificationProof: e.target.files[0]})}
                    />
                    <label htmlFor="idProof" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                      Choose File
                    </label>
                    {formData.identificationProof && (
                      <p className="mt-2 text-sm text-green-600">
                        ✓ {formData.identificationProof.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Business Proof *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600 mb-2">Upload Business Certificate, GST Registration, or Trade License</p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="businessProof"
                      onChange={(e) => setFormData({...formData, businessProof: e.target.files[0]})}
                    />
                    <label htmlFor="businessProof" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                      Choose File
                    </label>
                    {formData.businessProof && (
                      <p className="mt-2 text-sm text-green-600">
                        ✓ {formData.businessProof.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 mr-3 h-5 w-5 text-blue-600 rounded"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                    />
                    <span className="text-gray-700">
                      I agree to the{' '}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms & Conditions
                      </Link>{' '}
                      and confirm that all information provided is accurate. I understand that
                      fake information may lead to account suspension and legal action.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 pt-6 border-t">
            <button
              type="button"
              onClick={handleBack}
              className={`px-8 py-3 rounded-lg font-medium ${
                step === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              disabled={step === 1}
            >
              Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Continue to {step === 1 ? 'Business Details' : 'Verification'}
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                Submit for Verification
              </button>
            )}
          </div>
        </form>

        <div className="text-center mt-8 text-gray-600">
          <p>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">
              Sign In
            </Link>
          </p>
          <p className="mt-2 text-sm">
            Want to attend events instead?{' '}
            <Link href="/auth/register/user" className="text-purple-600 font-medium hover:underline">
              Register as User
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}