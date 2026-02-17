#!/usr/bin/env node
/**
 * Deploy the built site (out/) to a remote host via rsync over SSH.
 * Used for cPanel: uploads to ~/public_html (or DEPLOY_PATH).
 *
 * Requires: DEPLOY_HOST (e.g. cpanel_user@regardenus.org or user@ip)
 * Optional: DEPLOY_PATH (default ~/public_html), DEPLOY_SSH_KEY, DEPLOY_SSH_PORT
 *
 * Usage:
 *   npm run deploy              # build + upload
 *   npm run deploy:dry-run      # build + show what would be uploaded
 *   node scripts/deploy.mjs     # upload only (assumes out/ exists)
 *   node scripts/deploy.mjs --dry-run
 */

import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const outDir = path.join(rootDir, 'out')

function loadEnv(name) {
  const v = process.env[name]
  if (v !== undefined && v !== '') return v
  const envPath = path.join(rootDir, '.env.local')
  try {
    const content = fs.readFileSync(envPath, 'utf8')
    for (const line of content.split('\n')) {
      const m = line.match(new RegExp(`^${name}=(.*)$`))
      if (m) {
        const val = m[1].trim().replace(/^["']|["']$/g, '')
        return val || null
      }
    }
  } catch {
    // ignore
  }
  return null
}

const deployHost = loadEnv('DEPLOY_HOST') || process.env.DEPLOY_HOST
const deployPath = loadEnv('DEPLOY_PATH') || process.env.DEPLOY_PATH || '~/public_html'
const sshKey = loadEnv('DEPLOY_SSH_KEY') || process.env.DEPLOY_SSH_KEY || '~/.ssh/regarden'
const sshPort = loadEnv('DEPLOY_SSH_PORT') || process.env.DEPLOY_SSH_PORT
const dryRun = process.argv.includes('--dry-run')

if (!deployHost) {
  console.error('Missing DEPLOY_HOST. Set it in .env.local or environment, e.g.:')
  console.error('  DEPLOY_HOST=your_cpanel_user@regardenus.org')
  process.exit(1)
}

if (!fs.existsSync(outDir)) {
  console.error('Build output not found at out/. Run "npm run build" first.')
  process.exit(1)
}

const remote = `${deployHost}:${deployPath}`
// rsync: -a archive, -v verbose, -z compress. --delete removes remote files not in source.
const args = ['-avz', '--delete', '--progress']
if (dryRun) {
  args.push('--dry-run', '-n')
  console.log('Dry run: would sync out/ to', remote)
}
args.push(`${outDir}/`, remote)

const sshParts = ['ssh']
if (sshKey) sshParts.push('-i', sshKey.includes(' ') ? `"${sshKey}"` : sshKey)
if (sshPort) sshParts.push('-p', String(sshPort))
if (sshParts.length > 1) args.push('-e', sshParts.join(' '))

console.log('Running: rsync', args.join(' '))
const result = spawnSync('rsync', args, { stdio: 'inherit', cwd: rootDir })
if (result.status !== 0) {
  process.exit(result.status ?? 1)
}
console.log(dryRun ? 'Dry run complete.' : 'Deploy complete.')
