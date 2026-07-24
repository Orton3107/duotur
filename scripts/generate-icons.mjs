import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'icons')
mkdirSync(outDir, { recursive: true })

// Simple owl-ish/flag-ish mark on a rounded green square, in the Duolingo palette,
// with a crescent+star nod to Turkish flag colors on a small badge.
const svg = (size, safeZone = 0) => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="${safeZone ? 0 : 110}" fill="#58CC02"/>
  <circle cx="256" cy="230" r="150" fill="#FFFFFF"/>
  <circle cx="256" cy="230" r="150" fill="none"/>
  <path d="M 210 170 A 90 90 0 1 0 300 300 A 110 110 0 1 1 210 170 Z" fill="#E30A17"/>
  <g transform="translate(330,190) rotate(20)">
    <path d="M0 -22 L6 -7 L22 -7 L9 3 L14 18 L0 8 L-14 18 L-9 3 L-22 -7 L-6 -7 Z" fill="#E30A17"/>
  </g>
  <text x="256" y="430" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="72" fill="#FFFFFF" text-anchor="middle">TR</text>
</svg>
`

const targets = [
  { name: 'icon-192.png', size: 192, safeZone: 0 },
  { name: 'icon-512.png', size: 512, safeZone: 0 },
  { name: 'icon-maskable-192.png', size: 192, safeZone: 1 },
  { name: 'icon-maskable-512.png', size: 512, safeZone: 1 },
  { name: 'apple-touch-icon.png', size: 180, safeZone: 0 },
]

for (const t of targets) {
  await sharp(Buffer.from(svg(t.size, t.safeZone)))
    .resize(t.size, t.size)
    .png()
    .toFile(path.join(outDir, t.name))
  console.log('wrote', t.name)
}

// favicon
await sharp(Buffer.from(svg(64, 0))).resize(64, 64).png().toFile(path.join(outDir, 'favicon.png'))
console.log('done')
