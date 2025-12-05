import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';


export async function POST(req) {
  try {
    console.log('🔐 Organizer registration API called');
    
    // Connect to database
    await dbConnect();
    console.log('✅ Database connected');
    
    // Parse the request body
    const body = await req.json();
    console.log('📝 Registration data received');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      console.log('❌ User already exists:', body.email);
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);
    console.log('🔑 Password hashed');

    // Create organizer user
    const userData = {
      email: body.email,
      password: hashedPassword,
      role: 'organizer',
      organizerProfile: {
        fullName: body.organizerProfile?.fullName || '',
        businessName: body.organizerProfile?.businessName || '',
        businessType: body.organizerProfile?.businessType || 'individual',
        taxId: body.organizerProfile?.taxId || '',
        businessAddress: body.organizerProfile?.businessAddress || '',
        city: body.organizerProfile?.city || '',
        state: body.organizerProfile?.state || '',
        phone: body.organizerProfile?.phone || '',
        website: body.organizerProfile?.website || '',
        businessRegistrationNumber: body.organizerProfile?.businessRegistrationNumber || '',
        isVerified: false,
        verificationStatus: 'pending'
      }
    };

    console.log('📦 Creating user with data:', userData);
    
    const user = await User.create(userData);
    console.log('✅ User created successfully:', user.email);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(
      { 
        success: true,
        message: 'Organizer registration submitted for verification',
        user: userResponse
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('🔥 Organizer registration error:', error);
    console.error('🔥 Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}