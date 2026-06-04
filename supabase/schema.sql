-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create USERS table
CREATE TABLE public.users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., ADM001, STU001
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  class VARCHAR(50),
  board VARCHAR(50),
  medium VARCHAR(50),
  language VARCHAR(50),
  batch_id UUID, -- Foreign key to batches (added later or updated)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create BATCHES table
CREATE TABLE public.batches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  class VARCHAR(50) NOT NULL,
  board VARCHAR(50) NOT NULL,
  teacher_id UUID REFERENCES public.users(id),
  schedule JSONB, -- Array of objects or strings detailing times
  capacity INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add batch_id foreign key constraint to users
ALTER TABLE public.users
  ADD CONSTRAINT fk_batch
  FOREIGN KEY (batch_id) REFERENCES public.batches(id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (For Phase 1, you can refine these later)

-- Admins can read everything
CREATE POLICY "Admins can do everything on users" ON public.users
  FOR ALL
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'Admin'
  );

CREATE POLICY "Admins can do everything on batches" ON public.batches
  FOR ALL
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'Admin'
  );

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT
  USING (id = auth.uid() OR auth.uid() IS NULL); 
  -- Note: auth.uid() IS NULL is temporarily allowed here if you are using custom auth instead of Supabase Auth. 
  -- For production, if using custom auth without Supabase JWTs, RLS needs to check the role differently (e.g. via an edge function) or be bypassed by the service role key.

-- Insert some dummy data for testing the frontend
INSERT INTO public.users (user_id, name, role, class, board, medium)
VALUES 
  ('ADM001', 'Admin Super', 'Admin', null, null, null),
  ('TCH001', 'Teacher John', 'Teacher', '10', 'CBSE', 'English'),
  ('STU001', 'Student Mark', 'Student', '10', 'CBSE', 'English'),
  ('PAR001', 'Parent Mary', 'Parent', null, null, null);

-- Phase 3: Mock Test Engine Tables

-- Create QUESTIONS table
CREATE TABLE public.questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject VARCHAR(100),
  chapter VARCHAR(100),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of strings e.g. ["A", "B", "C", "D"]
  correct_option INTEGER NOT NULL, -- Index of correct option (0-3)
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create TESTS table
CREATE TABLE public.tests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subject_id VARCHAR(100), -- Using string for simplicity, or UUID if subject table exists
  chapter_id VARCHAR(100),
  board VARCHAR(50),
  class VARCHAR(50),
  timer_minutes INTEGER DEFAULT 60,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create TEST_QUESTIONS mapping
CREATE TABLE public.test_questions (
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  marks INTEGER DEFAULT 4,
  "order" INTEGER,
  PRIMARY KEY (test_id, question_id)
);

-- Create TEST_RESULTS table
CREATE TABLE public.test_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  total_marks INTEGER,
  time_taken INTEGER, -- in seconds
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create STUDENT_ANSWERS table
CREATE TABLE public.student_answers (
  result_id UUID REFERENCES public.test_results(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  student_answer INTEGER, -- Index of chosen option
  is_correct BOOLEAN,
  marks_awarded INTEGER DEFAULT 0,
  PRIMARY KEY (result_id, question_id)
);

-- Mock Data for Testing
INSERT INTO public.questions (id, subject, chapter, question_text, options, correct_option) VALUES
('11111111-1111-1111-1111-111111111111', 'Science', 'Optics', 'What is the speed of light?', '["3x10^8 m/s", "3x10^5 m/s", "3x10^2 m/s", "3x10^10 m/s"]', 0),
('22222222-2222-2222-2222-222222222222', 'Science', 'Optics', 'Which lens is converging?', '["Concave", "Convex", "Plano-concave", "Cylindrical"]', 1),
('33333333-3333-3333-3333-333333333333', 'Math', 'Algebra', 'Solve: 2x = 10', '["2", "5", "8", "12"]', 1);

INSERT INTO public.tests (id, title, subject_id, chapter_id, board, class, timer_minutes, is_published) VALUES
('44444444-4444-4444-4444-444444444444', 'Optics Weekly Test', 'Science', 'Optics', 'CBSE', '10', 30, true);

INSERT INTO public.test_questions (test_id, question_id, marks, "order") VALUES
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 4, 1),
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 4, 2);

-- Phase 4: Teacher Portal Tables

-- Create ATTENDANCE table
CREATE TABLE public.attendance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL,
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'Present', -- Present, Absent, Late
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, batch_id, student_id)
);

-- Create DOUBTS table (Global Q&A Database)
CREATE TABLE public.doubts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.users(id),
  question_text TEXT NOT NULL,
  answer_text TEXT,
  subject VARCHAR(100),
  class VARCHAR(50),
  board VARCHAR(50),
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create MATERIALS table (Content Uploads)
CREATE TABLE public.materials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  type VARCHAR(50), -- pdf, image, video
  subject VARCHAR(100),
  chapter VARCHAR(100),
  class VARCHAR(50),
  board VARCHAR(50),
  uploaded_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Phase 5: Admin Portal Tables

-- Add is_approved flag to doubts table
ALTER TABLE public.doubts ADD COLUMN is_approved BOOLEAN DEFAULT FALSE;

-- Create FEE_STRUCTURES table
CREATE TABLE public.fee_structures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  frequency VARCHAR(50) DEFAULT 'Monthly', -- Monthly, Yearly, One-time
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create FEE_PAYMENTS table
CREATE TABLE public.fee_payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount_paid DECIMAL(10,2) NOT NULL,
  receipt_no VARCHAR(100) UNIQUE NOT NULL,
  payment_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Paid', -- Paid, Pending
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create ANNOUNCEMENTS table
CREATE TABLE public.announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  target_audience VARCHAR(100) DEFAULT 'All', -- All, BatchID, Board
  scheduled_for TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Phase 6: WOW Features Tables

-- Create STUDENT_STATS table (Gamification)
CREATE TABLE public.student_stats (
  student_id UUID REFERENCES public.users(id) PRIMARY KEY,
  xp INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  freezes_available INTEGER DEFAULT 1,
  last_login DATE,
  rank INTEGER DEFAULT 0
);

-- Create STUDENT_BADGES table
CREATE TABLE public.student_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  badge_name VARCHAR(100) NOT NULL,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, badge_name)
);

-- Create STUDY_PLANS table
CREATE TABLE public.study_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  task_name VARCHAR(255) NOT NULL,
  subject VARCHAR(100),
  due_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create BATTLES table (Brain Battle)
CREATE TABLE public.battles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  player1_id UUID REFERENCES public.users(id),
  player2_id UUID REFERENCES public.users(id),
  winner_id UUID REFERENCES public.users(id),
  status VARCHAR(50) DEFAULT 'Pending', -- Pending, Active, Completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create NOTIFICATIONS table
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50), -- Test, Doubt, Rank, System
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
