// app/api/auth/direct-login/route.js - SIMPLE VERSION
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    console.log("🚀 Direct login API called");
    
    const { email, password } = await request.json();
    
    console.log("🔐 Attempting login for:", email);
    
    // Connect to DB
    await dbConnect();
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      console.log("❌ User not found");
      return Response.json({ 
        success: false, 
        error: "User not found" 
      }, { status: 404 });
    }
    
    console.log("✅ User found:", user.email, "Role:", user.role);
    
    // Check password
    if (!user.password) {
      console.log("❌ No password in user document");
      return Response.json({ 
        success: false, 
        error: "No password stored" 
      });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      console.log("❌ Password invalid");
      return Response.json({ 
        success: false, 
        error: "Invalid password" 
      }, { status: 401 });
    }
    
    console.log("✅ Password valid!");
    
    // Create JWT token
    const token = await new SignJWT({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));
    
    console.log("✅ Token created");
    
    // Get cookie store
    const cookieStore = await cookies();
    
    // Set auth token cookie
    cookieStore.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    
    // Also set a simple session cookie for frontend
    cookieStore.set({
      name: "user-session",
      value: JSON.stringify({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      }),
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
    
    console.log("🎉 Login successful! Cookies set.");
    
    // Determine redirect path
    let redirectTo = '/';
    if (user.role === 'organizer') {
      redirectTo = '/organiser/dashboard';
    } else if (user.role === 'user') {
      redirectTo = '/user/dashboard';
    }
    
    return Response.json({
      success: true,
      message: "Login successful",
      redirectTo: redirectTo,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error("🔥 Direct login error:", error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}