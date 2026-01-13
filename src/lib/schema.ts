import { 
  pgTable, 
  serial, 
  text, 
  integer, 
  boolean, 
  timestamp,
  pgEnum,
  jsonb
} from 'drizzle-orm/pg-core';

// Enums
export const projectTypeEnum = pgEnum('project_type', ['free', 'premium']);
export const projectCategoryEnum = pgEnum('project_category', ['developer', 'student']);
export const contactStatusEnum = pgEnum('contact_status', ['new', 'read', 'responded', 'archived']);
export const donationFrequencyEnum = pgEnum('donation_frequency', ['one-time', 'monthly', 'yearly']);
export const donationPlatformEnum = pgEnum('donation_platform', ['github', 'kofi', 'other']);

// Projects Table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  githubUrl: text('github_url').notNull(),
  language: text('language').notNull(),
  stars: integer('stars').default(0).notNull(),
  license: text('license').notNull(),
  type: projectTypeEnum('type').notNull(),
  featured: boolean('featured').default(false).notNull(),
  category: projectCategoryEnum('category').notNull(),
  tags: jsonb('tags').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Team Members Table
export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  bio: text('bio').notNull(),
  image: text('image').notNull(),
  github: text('github'),
  linkedin: text('linkedin'),
  specialties: jsonb('specialties').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Contact Messages Table
export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: contactStatusEnum('status').default('new').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Donations Table (future enhancement)
export const donations = pgTable('donations', {
  id: serial('id').primaryKey(),
  donorName: text('donor_name'),
  donorEmail: text('donor_email'),
  amount: integer('amount').notNull(), // Amount in cents
  frequency: donationFrequencyEnum('frequency').notNull(),
  platform: donationPlatformEnum('platform').notNull(),
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Newsletter Subscriptions Table (future enhancement)
export const newsletterSubscriptions = pgTable('newsletter_subscriptions', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

// TypeScript types inferred from schema
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
export type Donation = typeof donations.$inferSelect;
export type NewDonation = typeof donations.$inferInsert;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type NewNewsletterSubscription = typeof newsletterSubscriptions.$inferInsert;
