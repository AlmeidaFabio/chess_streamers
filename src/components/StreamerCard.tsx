import { useState } from 'react'
import type { Streamer } from '../api/streamers'

type StreamerCardProps = {
  streamer: Streamer
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

function initials(username: string): string {
  return username.slice(0, 2).toUpperCase()
}

function TwitchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="currentColor" d="M4 3h18v12l-5 5h-4l-3 3v-3H6v-4H3V6l1-3Zm2 2v9h4v3l3-3h4l3-3V5H6Zm5 2h2v5h-2V7Zm5 0h2v5h-2V7Z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  )
}

function KickIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="currentColor" d="M3 3h7v6h3V6h3V3h5v6h-4v3h4v9h-5v-3h-3v-3h-3v6H3V3Z" />
    </svg>
  )
}

export function StreamerCard({
  streamer,
  isFavorite,
  onToggleFavorite,
}: StreamerCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showAvatar = Boolean(streamer.avatar) && !imageFailed
  const avatarStatusClass = streamer.isLive
    ? 'border-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.5)]'
    : 'border-zinc-500'

  return (
    <article className="group flex min-h-28 items-center gap-4 rounded-2xl border border-zinc-800/90 bg-zinc-900/70 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-lg hover:shadow-black/20 sm:p-5">
      <div className="relative size-12 shrink-0">
        {showAvatar ? (
          <img
            src={streamer.avatar}
            alt={`Avatar de ${streamer.username}`}
            width={50}
            height={50}
            className={`size-12 rounded-full border-2 object-cover ${avatarStatusClass}`}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className={`flex size-12 items-center justify-center rounded-full border-2 bg-zinc-700 text-sm font-semibold text-zinc-200 ${avatarStatusClass}`}
            aria-hidden="true"
          >
            {initials(streamer.username)}
          </div>
        )}
        {streamer.isLive ? (
          <span
            className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-zinc-900 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            role="img"
            aria-label="Ao vivo"
            title="Ao vivo"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1 self-stretch py-0.5">
        <div className="flex flex-col items-start gap-2">
          <a
            href={streamer.chessUrl}
            target="_blank"
            rel="noreferrer"
            className="max-w-full break-all font-semibold leading-snug text-zinc-50 hover:underline"
          >
            {streamer.username}
          </a>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {streamer.twitchUrl ? (
            <a href={streamer.twitchUrl} target="_blank" rel="noreferrer" aria-label={`${streamer.username} na Twitch`} title="Twitch" className="rounded p-1 text-violet-300 transition hover:bg-zinc-800 hover:text-violet-200 focus-visible:outline-2 focus-visible:outline-violet-400">
              <TwitchIcon />
            </a>
          ) : null}
          {streamer.youtubeUrl ? (
            <a href={streamer.youtubeUrl} target="_blank" rel="noreferrer" aria-label={`${streamer.username} no YouTube`} title="YouTube" className="rounded p-1 text-red-300 transition hover:bg-zinc-800 hover:text-red-200 focus-visible:outline-2 focus-visible:outline-red-400">
              <YouTubeIcon />
            </a>
          ) : null}
          {streamer.kickUrl ? (
            <a href={streamer.kickUrl} target="_blank" rel="noreferrer" aria-label={`${streamer.username} na Kick`} title="Kick" className="rounded p-1 text-emerald-300 transition hover:bg-zinc-800 hover:text-emerald-200 focus-visible:outline-2 focus-visible:outline-emerald-400">
              <KickIcon />
            </a>
          ) : null}
          {!streamer.twitchUrl && !streamer.youtubeUrl && !streamer.kickUrl ? (
            <span className="text-zinc-500">Sem links de stream</span>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        aria-pressed={isFavorite}
        aria-label={
          isFavorite
            ? `Remover ${streamer.username} dos favoritos`
            : `Adicionar ${streamer.username} aos favoritos`
        }
        onClick={() => onToggleFavorite(streamer.id)}
        className={`-mr-1 -mt-1 shrink-0 rounded-lg p-2 transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-amber-300 ${
          isFavorite ? 'text-amber-400' : 'text-zinc-500 hover:text-amber-300'
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path
            d="M12 3.6 14.5 9l6 .9-4.3 4.2 1 6L12 17.3 6.8 20.1l1-6L3.5 9.9 9.5 9 12 3.6Z"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </article>
  )
}
