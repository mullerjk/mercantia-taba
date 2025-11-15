/**
 * Application configuration
 * Centralized place for environment variables and config
 */

/**
 * Validates that required environment variables are set
 * Throws error in production if critical variables are missing or using default values
 */
function validateConfig() {
  const isProduction = process.env.NODE_ENV === 'production'
  const jwtSecret = process.env.JWT_SECRET

  if (isProduction) {
    if (!jwtSecret || jwtSecret === 'your-secret-key-change-in-production') {
      throw new Error(
        'CRITICAL: JWT_SECRET environment variable must be set with a secure value in production! ' +
        'Generate one with: openssl rand -base64 32'
      )
    }
  }
}

// Run validation on module load
validateConfig()

export const config = {
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // App
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Database
  databaseUrl: process.env.DATABASE_URL || '',

  // Authentication
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: '7d',

  // Supabase (optional)
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },

  // Vendure
  vendure: {
    webhookSecret: process.env.VENDURE_WEBHOOK_SECRET || '',
  },
} as const
