-- Create quiz_questions table
CREATE TABLE quiz_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create quiz_results table
CREATE TABLE quiz_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies for quiz_questions
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quiz questions are viewable by everyone"
    ON quiz_questions FOR SELECT
    USING (true);

CREATE POLICY "Quiz questions are insertable by admins"
    ON quiz_questions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Quiz questions are updatable by admins"
    ON quiz_questions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Quiz questions are deletable by admins"
    ON quiz_questions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create RLS policies for quiz_results
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz results"
    ON quiz_results FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz results"
    ON quiz_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all quiz results"
    ON quiz_results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Insert some sample questions
INSERT INTO quiz_questions (question, options, correct_answer, points) VALUES
    (
        'Quel est le cocktail national de Cuba ?',
        ARRAY['Mojito', 'Daiquiri', 'Cuba Libre', 'Piña Colada'],
        'Mojito',
        10
    ),
    (
        'Quel ingrédient n''est PAS présent dans un Margarita ?',
        ARRAY['Tequila', 'Triple Sec', 'Vodka', 'Citron vert'],
        'Vodka',
        10
    ),
    (
        'Quel est le cocktail le plus vendu au monde ?',
        ARRAY['Martini', 'Old Fashioned', 'Negroni', 'Manhattan'],
        'Martini',
        10
    ),
    (
        'Dans quel pays est né le cocktail Manhattan ?',
        ARRAY['France', 'Italie', 'États-Unis', 'Royaume-Uni'],
        'États-Unis',
        10
    ),
    (
        'Quel est le principal ingrédient d''un Mojito ?',
        ARRAY['Rhum', 'Vodka', 'Gin', 'Whisky'],
        'Rhum',
        10
    ); 