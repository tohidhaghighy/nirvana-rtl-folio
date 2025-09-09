import { createClient } from '@supabase/supabase-js';
import sql from 'mssql';
import 'dotenv/config';

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY; // You'll need the service key for full access

// SQL Server configuration
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

async function migrateData() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('Supabase credentials not found. Please add SUPABASE_URL and SUPABASE_SERVICE_KEY to your .env file');
    console.log('You can find these in your Supabase project settings.');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  try {
    // Connect to SQL Server
    const pool = await sql.connect(sqlConfig);
    console.log('Connected to SQL Server');

    // Migrate blogs
    console.log('Migrating blogs...');
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('*');

    if (blogsError) {
      console.error('Error fetching blogs:', blogsError);
    } else if (blogs && blogs.length > 0) {
      for (const blog of blogs) {
        await pool.request()
          .input('id', sql.UniqueIdentifier, blog.id)
          .input('authorId', sql.UniqueIdentifier, blog.author_id)
          .input('title', sql.NVarChar, blog.title)
          .input('content', sql.NVarChar(sql.MAX), blog.content)
          .input('excerpt', sql.NVarChar, blog.excerpt)
          .input('slug', sql.NVarChar, blog.slug)
          .input('published', sql.Bit, blog.published)
          .input('featuredImageUrl', sql.NVarChar, blog.featured_image_url)
          .input('createdAt', sql.DateTime2, new Date(blog.created_at))
          .input('updatedAt', sql.DateTime2, new Date(blog.updated_at))
          .query(`
            INSERT INTO blogs (id, author_id, title, content, excerpt, slug, published, featured_image_url, created_at, updated_at)
            VALUES (@id, @authorId, @title, @content, @excerpt, @slug, @published, @featuredImageUrl, @createdAt, @updatedAt)
          `);
      }
      console.log(`Migrated ${blogs.length} blogs`);
    }

    // Migrate contact submissions
    console.log('Migrating contact submissions...');
    const { data: submissions, error: submissionsError } = await supabase
      .from('contact_submissions')
      .select('*');

    if (submissionsError) {
      console.error('Error fetching contact submissions:', submissionsError);
    } else if (submissions && submissions.length > 0) {
      for (const submission of submissions) {
        await pool.request()
          .input('id', sql.UniqueIdentifier, submission.id)
          .input('name', sql.NVarChar, submission.name)
          .input('email', sql.NVarChar, submission.email)
          .input('phone', sql.NVarChar, submission.phone)
          .input('subject', sql.NVarChar, submission.subject)
          .input('message', sql.NVarChar(sql.MAX), submission.message)
          .input('status', sql.NVarChar, submission.status)
          .input('userId', sql.UniqueIdentifier, submission.user_id)
          .input('adminNotes', sql.NVarChar(sql.MAX), submission.admin_notes)
          .input('reviewedBy', sql.UniqueIdentifier, submission.reviewed_by)
          .input('reviewedAt', sql.DateTime2, submission.reviewed_at ? new Date(submission.reviewed_at) : null)
          .input('createdAt', sql.DateTime2, new Date(submission.created_at))
          .input('updatedAt', sql.DateTime2, new Date(submission.updated_at))
          .query(`
            INSERT INTO contact_submissions (id, name, email, phone, subject, message, status, user_id, admin_notes, reviewed_by, reviewed_at, created_at, updated_at)
            VALUES (@id, @name, @email, @phone, @subject, @message, @status, @userId, @adminNotes, @reviewedBy, @reviewedAt, @createdAt, @updatedAt)
          `);
      }
      console.log(`Migrated ${submissions.length} contact submissions`);
    }

    // Migrate ticket responses
    console.log('Migrating ticket responses...');
    const { data: responses, error: responsesError } = await supabase
      .from('ticket_responses')
      .select('*');

    if (responsesError) {
      console.error('Error fetching ticket responses:', responsesError);
    } else if (responses && responses.length > 0) {
      for (const response of responses) {
        await pool.request()
          .input('id', sql.UniqueIdentifier, response.id)
          .input('submissionId', sql.UniqueIdentifier, response.submission_id)
          .input('message', sql.NVarChar(sql.MAX), response.message)
          .input('isAdminResponse', sql.Bit, response.is_admin_response)
          .input('createdAt', sql.DateTime2, new Date(response.created_at))
          .input('updatedAt', sql.DateTime2, new Date(response.updated_at))
          .query(`
            INSERT INTO ticket_responses (id, submission_id, message, is_admin_response, created_at, updated_at)
            VALUES (@id, @submissionId, @message, @isAdminResponse, @createdAt, @updatedAt)
          `);
      }
      console.log(`Migrated ${responses.length} ticket responses`);
    }

    // Migrate profiles (this will help with user context)
    console.log('Migrating profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    } else if (profiles && profiles.length > 0) {
      for (const profile of profiles) {
        await pool.request()
          .input('id', sql.UniqueIdentifier, profile.id)
          .input('userId', sql.UniqueIdentifier, profile.user_id)
          .input('fullName', sql.NVarChar, profile.full_name)
          .input('email', sql.NVarChar, profile.email)
          .input('role', sql.NVarChar, profile.role)
          .input('createdAt', sql.DateTime2, new Date(profile.created_at))
          .input('updatedAt', sql.DateTime2, new Date(profile.updated_at))
          .query(`
            INSERT INTO profiles (id, user_id, full_name, email, role, created_at, updated_at)
            VALUES (@id, @userId, @fullName, @email, @role, @createdAt, @updatedAt)
          `);
      }
      console.log(`Migrated ${profiles.length} profiles`);
    }

    // Migrate time logs
    console.log('Migrating time logs...');
    const { data: timeLogs, error: timeLogsError } = await supabase
      .from('time_logs')
      .select('*');

    if (timeLogsError) {
      console.error('Error fetching time logs:', timeLogsError);
    } else if (timeLogs && timeLogs.length > 0) {
      for (const timeLog of timeLogs) {
        await pool.request()
          .input('id', sql.UniqueIdentifier, timeLog.id)
          .input('workerId', sql.UniqueIdentifier, timeLog.worker_id)
          .input('date', sql.Date, new Date(timeLog.date))
          .input('hoursWorked', sql.Decimal(5, 2), timeLog.hours_worked)
          .input('description', sql.NVarChar, timeLog.description)
          .input('createdAt', sql.DateTime2, new Date(timeLog.created_at))
          .input('updatedAt', sql.DateTime2, new Date(timeLog.updated_at))
          .query(`
            INSERT INTO time_logs (id, worker_id, date, hours_worked, description, created_at, updated_at)
            VALUES (@id, @workerId, @date, @hoursWorked, @description, @createdAt, @updatedAt)
          `);
      }
      console.log(`Migrated ${timeLogs.length} time logs`);
    }

    // Migrate day off requests
    console.log('Migrating day off requests...');
    const { data: dayOffRequests, error: dayOffError } = await supabase
      .from('day_off_requests')
      .select('*');

    if (dayOffError) {
      console.error('Error fetching day off requests:', dayOffError);
    } else if (dayOffRequests && dayOffRequests.length > 0) {
      for (const request of dayOffRequests) {
        await pool.request()
          .input('id', sql.UniqueIdentifier, request.id)
          .input('workerId', sql.UniqueIdentifier, request.worker_id)
          .input('requestDate', sql.Date, new Date(request.request_date))
          .input('reason', sql.NVarChar, request.reason)
          .input('status', sql.NVarChar, request.status)
          .input('adminNotes', sql.NVarChar, request.admin_notes)
          .input('reviewedBy', sql.UniqueIdentifier, request.reviewed_by)
          .input('reviewedAt', sql.DateTime2, request.reviewed_at ? new Date(request.reviewed_at) : null)
          .input('createdAt', sql.DateTime2, new Date(request.created_at))
          .input('updatedAt', sql.DateTime2, new Date(request.updated_at))
          .query(`
            INSERT INTO day_off_requests (id, worker_id, request_date, reason, status, admin_notes, reviewed_by, reviewed_at, created_at, updated_at)
            VALUES (@id, @workerId, @requestDate, @reason, @status, @adminNotes, @reviewedBy, @reviewedAt, @createdAt, @updatedAt)
          `);
      }
      console.log(`Migrated ${dayOffRequests.length} day off requests`);
    }

    console.log('Data migration completed successfully!');

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await sql.close();
  }
}

// Run the migration
migrateData().catch(console.error);