import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputPath = resolve(projectRoot, 'public/streamers.json')

const response = await fetch('https://api.chess.com/pub/streamers', {
  headers: {
    Accept: 'application/json',
    'User-Agent': 'ChessStreamers/1.0 (https://github.com/AlmeidaFabio/chess_streamers)',
  },
  signal: AbortSignal.timeout(30_000),
})

if (!response.ok) {
  throw new Error(`Chess.com API request failed: ${response.status} ${response.statusText}`)
}

const data = await response.json()
if (!Array.isArray(data.streamers)) {
  throw new Error('Chess.com API returned an unexpected response.')
}

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(data)}\n`, 'utf8')
console.log(`Saved ${data.streamers.length} streamers to public/streamers.json`)
