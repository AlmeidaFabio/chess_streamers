import type { Streamer } from '../api/streamers'
import { StreamerCard } from './StreamerCard'

type StreamerListProps = {
  streamers: Streamer[]
  emptyMessage: string
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
}

export function StreamerList({
  streamers,
  emptyMessage,
  isFavorite,
  onToggleFavorite,
}: StreamerListProps) {
  if (streamers.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-700 px-4 py-10 text-center text-zinc-400">
        {emptyMessage}
      </p>
    )
  }

  return (
    <ul className="grid gap-3">
      {streamers.map((streamer) => (
        <li key={streamer.id}>
          <StreamerCard
            streamer={streamer}
            isFavorite={isFavorite(streamer.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </li>
      ))}
    </ul>
  )
}
