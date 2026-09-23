require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};
