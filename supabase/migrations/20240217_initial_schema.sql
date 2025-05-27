-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create countries table
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(2) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cocktails table
CREATE TABLE cocktails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT[] NOT NULL,
    instructions TEXT NOT NULL,
    country_id UUID NOT NULL REFERENCES countries(id),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create favorites table
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    cocktail_id UUID NOT NULL REFERENCES cocktails(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, cocktail_id)
);

-- Create ratings table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    cocktail_id UUID NOT NULL REFERENCES cocktails(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, cocktail_id)
);

-- Create comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    cocktail_id UUID NOT NULL REFERENCES cocktails(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create quizzes table
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    options TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create quiz_answers table
CREATE TABLE quiz_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    quiz_id UUID NOT NULL REFERENCES quizzes(id),
    selected_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_cocktails_country_id ON cocktails(country_id);
CREATE INDEX idx_cocktails_created_by ON cocktails(created_by);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_cocktail_id ON favorites(cocktail_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_cocktail_id ON ratings(cocktail_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_cocktail_id ON comments(cocktail_id);
CREATE INDEX idx_quiz_answers_user_id ON quiz_answers(user_id);
CREATE INDEX idx_quiz_answers_quiz_id ON quiz_answers(quiz_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cocktails_updated_at
    BEFORE UPDATE ON cocktails
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at
    BEFORE UPDATE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cocktails ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Cocktails policies
CREATE POLICY "Anyone can view cocktails"
    ON cocktails FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create cocktails"
    ON cocktails FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own cocktails"
    ON cocktails FOR UPDATE
    USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own cocktails"
    ON cocktails FOR DELETE
    USING (auth.uid() = created_by);

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
    ON favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
    ON favorites FOR ALL
    USING (auth.uid() = user_id);

-- Ratings policies
CREATE POLICY "Anyone can view ratings"
    ON ratings FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their own ratings"
    ON ratings FOR ALL
    USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments"
    ON comments FOR SELECT
    USING (true);

CREATE POLICY "Users can create comments"
    ON comments FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own comments"
    ON comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
    ON comments FOR DELETE
    USING (auth.uid() = user_id);

-- Quizzes policies
CREATE POLICY "Anyone can view quizzes"
    ON quizzes FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage quizzes"
    ON quizzes FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- Quiz answers policies
CREATE POLICY "Users can view their own quiz answers"
    ON quiz_answers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz answers"
    ON quiz_answers FOR INSERT
    WITH CHECK (auth.uid() = user_id); 