import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { config } from 'dotenv';

// Load environment variables FIRST before any other imports
config({ path: resolve(process.cwd(), '.env') });

// Now import database modules after env is loaded
import { db } from './db';
import { projects, teamMembers } from './schema';

interface JsonProject {
  id: number;
  name: string;
  description: string;
  type: 'free' | 'premium';
  featured: boolean;
  stars: number;
  language: string;
  license: string;
  githubUrl: string;
  tags: string[];
  category: 'developer' | 'student';
}

interface JsonTeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  github?: string;
  linkedin?: string;
  specialties: string[];
}

async function migrate() {
  try {
    console.log('🚀 Starting database migration...\n');

    // Load projects from JSON
    const projectsPath = join(process.cwd(), 'public', 'data', 'projects.json');
    const projectsData: JsonProject[] = JSON.parse(readFileSync(projectsPath, 'utf-8'));
    
    console.log(`📦 Found ${projectsData.length} projects to migrate`);

    // Insert projects
    for (const project of projectsData) {
      await db.insert(projects).values({
        name: project.name,
        description: project.description,
        githubUrl: project.githubUrl,
        language: project.language,
        stars: project.stars,
        license: project.license,
        type: project.type,
        featured: project.featured,
        category: project.category,
        tags: project.tags,
      });
      console.log(`  ✓ Migrated project: ${project.name}`);
    }

    // Load team members from JSON
    const teamPath = join(process.cwd(), 'public', 'data', 'team.json');
    const teamData: JsonTeamMember[] = JSON.parse(readFileSync(teamPath, 'utf-8'));
    
    console.log(`\n👥 Found ${teamData.length} team members to migrate`);

    // Insert team members
    for (const member of teamData) {
      await db.insert(teamMembers).values({
        name: member.name,
        role: member.role,
        bio: member.bio,
        image: member.image,
        github: member.github,
        linkedin: member.linkedin,
        specialties: member.specialties,
      });
      console.log(`  ✓ Migrated team member: ${member.name}`);
    }

    console.log('\n✅ Migration completed successfully!');
    console.log(`   - ${projectsData.length} projects migrated`);
    console.log(`   - ${teamData.length} team members migrated`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
