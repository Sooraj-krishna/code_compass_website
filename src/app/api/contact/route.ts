import { NextRequest, NextResponse } from 'next/server';
import { createContactMessage, handleDatabaseError } from '@/lib/db-utils';
import { z } from 'zod';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = contactSchema.parse(body);
    
    // Save to database
    const contactMessage = await createContactMessage({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
      status: 'new',
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact message received successfully',
        id: contactMessage.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving contact message:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: handleDatabaseError(error) },
      { status: 500 }
    );
  }
}
