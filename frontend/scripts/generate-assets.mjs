import { existsSync } from 'fs'
import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const assetsDir = join(__dirname, '..', 'src', 'assets')
const logoPath = join(assetsDir, 'logo.png')
const logoSmPath = join(assetsDir, 'logo-sm.png')

if (!existsSync(logoPath)) {
  console.log('  logo.png not found, skipping logo-sm generation')
  process.exit(0)
}

if (existsSync(logoSmPath)) {
  console.log('  logo-sm.png already exists, skipping')
  process.exit(0)
}

console.log('  Generating logo-sm.png from logo.png...')
await sharp(logoPath)
  .resize({ height: 64 })
  .png()
  .toFile(logoSmPath)
console.log('  logo-sm.png generated')
