'use server';

import { z } from 'zod';
import { getUserByWalletAddress, createUser } from '@/lib/db/queries';
import { ChatSDKError } from '@/lib/errors';

const createUserSchema = z.object({
  walletAddress: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
});

export async function createUserAction(walletAddress: string, name: string) {
  try {
    // Validate input
    const validated = createUserSchema.parse({ walletAddress, name });

    // Check if user already exists
    const existingUsers = await getUserByWalletAddress(validated.walletAddress as `0x${string}`);
    
    if (existingUsers.length > 0) {
      return { 
        success: true, 
        message: 'User already exists', 
        user: existingUsers[0] 
      };
    }

    // Create new user
    const newUser = await createUser(validated.walletAddress, validated.name);
    
    return { 
      success: true, 
      message: 'User created successfully', 
      user: newUser 
    };

  } catch (error) {
    console.error('Error in user creation:', error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Invalid request data', 
        details: error.errors 
      };
    }
    
    if (error instanceof ChatSDKError) {
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    return { 
      success: false, 
      error: 'Internal server error' 
    };
  }
} 