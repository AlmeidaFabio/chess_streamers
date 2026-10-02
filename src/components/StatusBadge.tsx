type StatusBadgeProps = {
  isLive: boolean
}

export function StatusBadge({ isLive }: StatusBadgeProps) {
  if (isLive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-semibold text-red-400">
        <span className="size-1.5 animate-pulse rounded-full bg-red-500" aria-hidden="true" />
        Ao vivo
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-700/60 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
      <span className="size-1.5 rounded-full bg-zinc-500" aria-hidden="true" />
      Offline
    </span>
  )
}
