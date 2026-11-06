import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tbgmzteqmqetuscblpik.supabase.co'
const supabaseAnonKey = 'sb_publishable_egWYwm yB-5gAE-g_HdN1og_VgY2oT5u'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)