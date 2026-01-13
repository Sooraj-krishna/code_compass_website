import { NextResponse } from 'next/server';
import { getAllTeamMembers, handleDatabaseError } from '@/lib/db-utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const teamMembers = await getAllTeamMembers();
    
    return NextResponse.json(teamMembers, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: handleDatabaseError(error) },
      { status: 500 }
    );
  }
}
