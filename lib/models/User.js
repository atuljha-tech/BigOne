import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['organizer', 'user'], 
    required: true,
    default: 'user'
  },
  
  // ORGANIZER-SPECIFIC FIELDS
  organizerProfile: {
    fullName: { type: String },
    businessName: { 
      type: String, 
      required: function() { return this.role === 'organizer'; }
    },
    // ... rest of your organizer fields
  },
  
  // USER-SPECIFIC FIELDS
  userProfile: {
    firstName: { type: String },
    // ... rest of your user fields
  },
  
  // Common metadata
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true }
});

// FIX: Prevent model overwrite in Next.js hot reload
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;