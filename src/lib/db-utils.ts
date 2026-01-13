import { db } from './db';
import { projects, teamMembers, contactMessages, type NewContactMessage, type Project, type TeamMember } from './schema';
import { eq } from 'drizzle-orm';

// Projects utilities
export async function getAllProjects(): Promise<Project[]> {
  return await db.select().from(projects);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return await db.select().from(projects).where(eq(projects.featured, true));
}

export async function getProjectById(id: number): Promise<Project | undefined> {
  const result = await db.select().from(projects).where(eq(projects.id, id));
  return result[0];
}

// Team utilities
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  return await db.select().from(teamMembers);
}

export async function getTeamMemberById(id: number): Promise<TeamMember | undefined> {
  const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
  return result[0];
}

// Contact messages utilities
export async function createContactMessage(message: NewContactMessage) {
  const result = await db.insert(contactMessages).values(message).returning();
  return result[0];
}

export async function getAllContactMessages() {
  return await db.select().from(contactMessages);
}

// Helper function to handle database errors
export function handleDatabaseError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown database error occurred';
}
