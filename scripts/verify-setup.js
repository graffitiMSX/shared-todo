#!/usr/bin/env node

/**
 * Phase 1 Setup Verification Script
 *
 * Checks that all Phase 1 requirements are met before proceeding to Phase 2
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verifying Phase 1 Setup...\n');

let allChecksPassed = true;

// Check 1: Node modules installed
console.log('1. Checking node_modules...');
if (fs.existsSync(path.join(__dirname, '../node_modules'))) {
  console.log('   ✅ node_modules found');
} else {
  console.log('   ❌ node_modules not found. Run: npm install');
  allChecksPassed = false;
}

// Check 2: Environment variables
console.log('\n2. Checking environment variables...');
if (fs.existsSync(path.join(__dirname, '../.env.local'))) {
  console.log('   ✅ .env.local found');
  const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');

  if (envContent.includes('NEXT_PUBLIC_SUPABASE_URL=') &&
      !envContent.includes('your-supabase-url')) {
    console.log('   ✅ NEXT_PUBLIC_SUPABASE_URL is set');
  } else {
    console.log('   ❌ NEXT_PUBLIC_SUPABASE_URL not configured');
    allChecksPassed = false;
  }

  if (envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=') &&
      !envContent.includes('your-supabase-anon-key')) {
    console.log('   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set');
  } else {
    console.log('   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not configured');
    allChecksPassed = false;
  }
} else {
  console.log('   ❌ .env.local not found. Copy .env.local.example to .env.local');
  allChecksPassed = false;
}

// Check 3: Required files
console.log('\n3. Checking required files...');
const requiredFiles = [
  'middleware.ts',
  'lib/supabase/client.ts',
  'lib/supabase/server.ts',
  'lib/supabase/types.ts',
  'supabase/migrations/001_initial_schema.sql',
  'supabase/migrations/002_rls_policies.sql',
  'app/layout.tsx',
  'app/page.tsx',
  'tailwind.config.ts',
];

let filesOk = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, '..', file))) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} missing`);
    filesOk = false;
    allChecksPassed = false;
  }
});

if (filesOk) {
  console.log('   ✅ All required files present');
}

// Check 4: Directory structure
console.log('\n4. Checking directory structure...');
const requiredDirs = [
  'app',
  'lib/supabase',
  'lib/providers',
  'components/ui',
  'components/auth',
  'components/todos',
  'supabase/migrations',
];

let dirsOk = true;
requiredDirs.forEach(dir => {
  if (fs.existsSync(path.join(__dirname, '..', dir))) {
    console.log(`   ✅ ${dir}/`);
  } else {
    console.log(`   ❌ ${dir}/ missing`);
    dirsOk = false;
    allChecksPassed = false;
  }
});

if (dirsOk) {
  console.log('   ✅ Directory structure correct');
}

// Summary
console.log('\n' + '='.repeat(50));
if (allChecksPassed) {
  console.log('✅ All checks passed! Phase 1 setup is complete.');
  console.log('\n📋 Next steps:');
  console.log('   1. Create Supabase project at https://supabase.com');
  console.log('   2. Run database migrations in Supabase SQL Editor');
  console.log('   3. Start dev server: npm run dev');
  console.log('   4. Verify app loads at http://localhost:3000');
  console.log('\n📖 See SETUP.md for detailed instructions');
  console.log('\n🚀 Ready for Phase 2: Authentication!\n');
  process.exit(0);
} else {
  console.log('❌ Some checks failed. Please fix the issues above.');
  console.log('\n📖 See SETUP.md for help\n');
  process.exit(1);
}
