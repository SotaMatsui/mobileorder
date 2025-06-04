import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://gauvehvvywdffzavofsf.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdXZlaHZ2eXdkZmZ6YXZvZnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NTQ2NjMsImV4cCI6MjA2NDUzMDY2M30.TUcWTBYw2AaCsWPnqRBfpjkYEvHeS40zWj2g6P_R74s"
export const supabase = createClient(supabaseUrl, supabaseAnonKey)