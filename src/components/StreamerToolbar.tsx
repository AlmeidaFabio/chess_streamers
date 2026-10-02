type StreamerToolbarProps = {
  query: string
  onQueryChange: (value: string) => void
  onlyFavorites: boolean
  onOnlyFavoritesChange: (value: boolean) => void
  favoriteCount: number
  lastUpdated: number | null
  refreshing: boolean
  onRefresh: () => void
}

function formatUpdatedAt(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function StreamerToolbar({
  query,
  onQueryChange,
  onlyFavorites,
  onOnlyFavoritesChange,
  favoriteCount,
  lastUpdated,
  refreshing,
  onRefresh,
}: StreamerToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3">
      <label className="block">
        <span className="sr-only">Buscar por nome</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar por nome"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-violet-500"
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-pressed={onlyFavorites}
          onClick={() => onOnlyFavoritesChange(!onlyFavorites)}
          className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
            onlyFavorites
              ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
              : 'border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
          }`}
        >
          Favoritos{favoriteCount > 0 ? ` (${favoriteCount})` : ''}
        </button>

        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {refreshing ? 'Atualizando…' : 'Atualizar agora'}
        </button>

        {lastUpdated ? (
          <p className="ml-auto text-xs text-zinc-500">
            Atualizado às {formatUpdatedAt(lastUpdated)} · a cada 60s
          </p>
        ) : null}
      </div>
    </div>
  )
}
