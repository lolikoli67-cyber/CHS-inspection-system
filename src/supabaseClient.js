import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tbgmzteqmqetuscblpik.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZ216dGVxbXFldHVzY2JscGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5MDczODcsImV4cCI6MjEwOTQ4MzM4N30.TAL8VGzLP_ErIOfxoFgXd7lYjG0jkdzxNzX1O-PvQqg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)