// /app/api/auth/register/user/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req) {
  try {
    console.log('User registration API called');
    
    await dbConnect();
    const body = await req.json();
    console.log('User registration data:', body);

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await User.create({
      email: body.email,
      password: hashedPassword,
      role: 'user',
      userProfile: {
        firstName: body.userProfile?.firstName || '',
        lastName: body.userProfile?.lastName || '',
        phone: body.userProfile?.phone || '',
        dateOfBirth: body.userProfile?.dateOfBirth || '',
        gender: body.userProfile?.gender || ''
      }
    });

    console.log('User created successfully:', user.email);

    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(
      { 
        success: true,
        message: 'User registration successful',
        user: userResponse
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('User registration error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}