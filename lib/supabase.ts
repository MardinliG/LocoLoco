import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

// Client for read operations (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client for write operations (uses service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)

export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    username: string
                    role: 'user' | 'admin'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    username: string
                    role?: 'user' | 'admin'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    username?: string
                    role?: 'user' | 'admin'
                    created_at?: string
                    updated_at?: string
                }
            }
            cocktails: {
                Row: {
                    id: string
                    name: string
                    description: string
                    ingredients: string[]
                    instructions: string
                    country_id: string
                    created_by: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description: string
                    ingredients: string[]
                    instructions: string
                    country_id: string
                    created_by: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string
                    ingredients?: string[]
                    instructions?: string
                    country_id?: string
                    created_by?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            countries: {
                Row: {
                    id: string
                    name: string
                    code: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    code: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    code?: string
                    created_at?: string
                }
            }
            favorites: {
                Row: {
                    id: string
                    user_id: string
                    cocktail_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    cocktail_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    cocktail_id?: string
                    created_at?: string
                }
            }
            ratings: {
                Row: {
                    id: string
                    user_id: string
                    cocktail_id: string
                    rating: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    cocktail_id: string
                    rating: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    cocktail_id?: string
                    rating?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            comments: {
                Row: {
                    id: string
                    user_id: string
                    cocktail_id: string
                    content: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    cocktail_id: string
                    content: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    cocktail_id?: string
                    content?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            quizzes: {
                Row: {
                    id: string
                    question: string
                    correct_answer: string
                    options: string[]
                    created_at: string
                }
                Insert: {
                    id?: string
                    question: string
                    correct_answer: string
                    options: string[]
                    created_at?: string
                }
                Update: {
                    id?: string
                    question?: string
                    correct_answer?: string
                    options?: string[]
                    created_at?: string
                }
            }
            quiz_answers: {
                Row: {
                    id: string
                    user_id: string
                    quiz_id: string
                    selected_answer: string
                    is_correct: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    quiz_id: string
                    selected_answer: string
                    is_correct: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    quiz_id?: string
                    selected_answer?: string
                    is_correct?: boolean
                    created_at?: string
                }
            }
            quiz_results: {
                Row: {
                    id: string
                    user_id: string
                    score: number
                    total_questions: number
                    correct_answers: number
                    time_taken: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    score: number
                    total_questions: number
                    correct_answers: number
                    time_taken: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    score?: number
                    total_questions?: number
                    correct_answers?: number
                    time_taken?: number
                    created_at?: string
                }
            }
        }
    }
} 