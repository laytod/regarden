/**
 * Script to create the first admin user
 * Usage: npm run create-admin <email> <password> <name>
 * Example: npm run create-admin admin@regarden.org password123 "Admin User"
 */

import { createUser } from '../lib/auth'

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 3) {
    console.error('Usage: npx ts-node scripts/create-admin.ts <email> <password> <name>')
    process.exit(1)
  }

  const [email, password, name] = args

  try {
    const user = await createUser(email, password, name, 'admin')
    console.log('✅ Admin user created successfully!')
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   ID: ${user.id}`)
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  }
}

main()
