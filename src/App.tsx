import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchStreamers, type Streamer } from './api/streamers'
import { Pagination } from './components/Pagination'
import { StreamerList } from './components/StreamerList'
import { StreamerToolbar } from './components/StreamerToolbar'
import { useFavorites } from './hooks/useFavorites'
import { filterStreamers, pageCount, paginate, sortStreamers } from './lib/streamers'

export const REFRESH_INTERVAL_MS = 60_000

function SkeletonList() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <li
          key={index}
          className="h-28 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50"
        />
      ))}
    </ul>
  )
}

function emptyMessage(query: string, onlyFavorites: boolean): string {
  if (onlyFavorites) {
    return query
      ? 'Nenhum favorito corresponde à busca.'
      : 'Nenhum favorito ainda. Toque na estrela para salvar.'
  }

  if (query.trim()) {
    return 'Nenhum streamer encontrado para essa busca.'
  }

  return 'Nenhum streamer encontrado.'
}

function App() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const [streamers, setStreamers] = useState<Streamer[]>([])
  const [query, setQuery] = useState('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshError, setRefreshError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const fetchingRef = useRef(false)

  const load = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent === true
    if (fetchingRef.current) {
      return
    }

    fetchingRef.current = true
    if (silent) {
      setRefreshing(true)
    } else {
      setLoading(true)
      setError(null)
    }

    try {
      const data = await fetchStreamers()
      setStreamers(data)
      setLastUpdated(Date.now())
      setRefreshError(null)
      if (!silent) {
        setPage(1)
      }
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : 'Erro ao carregar streamers.'
      if (silent) {
        setRefreshError(message)
      } else {
        setError(message)
      }
    } finally {
      fetchingRef.current = false
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void load({ silent: true })
      }
    }, REFRESH_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [load])

  const filtered = useMemo(() => {
    const sorted = sortStreamers(streamers, favorites)
    return filterStreamers(sorted, query, onlyFavorites, favorites)
  }, [streamers, favorites, query, onlyFavorites])

  const liveCount = useMemo(
    () => streamers.filter((streamer) => streamer.isLive).length,
    [streamers],
  )

  const totalPages = pageCount(filtered.length)
  const currentPage = Math.min(page, totalPages)
  const pageItems = paginate(filtered, currentPage)

  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage)
    }
  }, [page, currentPage])

  const showInitialError = Boolean(error) && streamers.length === 0
  const showList = !showInitialError && (!loading || streamers.length > 0)
  const showSkeleton = loading && streamers.length === 0

  return (
    <div className="mx-auto min-h-svh max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-violet-300 uppercase">
          Chess.com
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Streamers
        </h1>
        {!showInitialError && streamers.length > 0 ? (
          <p className="mt-3 text-sm text-zinc-400">
            {liveCount} ao vivo · {filtered.length} exibidos · {streamers.length} no
            total
          </p>
        ) : null}
      </header>

      {!showInitialError ? (
        <StreamerToolbar
          query={query}
          onQueryChange={(value) => {
            setQuery(value)
            setPage(1)
          }}
          onlyFavorites={onlyFavorites}
          onOnlyFavoritesChange={(value) => {
            setOnlyFavorites(value)
            setPage(1)
          }}
          favoriteCount={favorites.size}
          lastUpdated={lastUpdated}
          refreshing={refreshing}
          onRefresh={() => void load({ silent: true })}
        />
      ) : null}

      {refreshError && streamers.length > 0 ? (
        <p className="mb-4 text-sm text-amber-300" role="status">
          Não foi possível atualizar agora. A lista anterior permanece visível.
        </p>
      ) : null}

      {showSkeleton ? <SkeletonList /> : null}

      {showInitialError ? (
        <div
          className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-6 text-center"
          role="alert"
        >
          <p className="text-red-200">{error}</p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
            onClick={() => void load()}
          >
            Tentar de novo
          </button>
        </div>
      ) : null}

      {showList ? (
        <>
          <StreamerList
            streamers={pageItems}
            emptyMessage={emptyMessage(query, onlyFavorites)}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
          {filtered.length > 0 ? (
            <Pagination
              page={currentPage}
              pageCount={totalPages}
              onPageChange={setPage}
            />
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export default App
