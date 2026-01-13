import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, getFeaturedProjects, handleDatabaseError } from '@/lib/db-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured');

    let projects;
    if (featured === 'true') {
      projects = await getFeaturedProjects();
    } else {
      projects = await getAllProjects();
    }

    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: handleDatabaseError(error) },
      { status: 500 }
    );
  }
}
