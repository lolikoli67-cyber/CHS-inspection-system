import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tbgmzteqmqetuscblpik.supabase.co'
const supabaseAnonKey = 'sb_secret_fQl0rk3BtLFgjf8bxTWQAg_2-tS2MZu'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)