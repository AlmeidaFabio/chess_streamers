import type { Streamer } from '../api/streamers.ts'

export const PAGE_SIZE = 15

export function sortStreamers(
  list: Streamer[],
  favorites: Set<string> = new Set(),
): Streamer[] {
  return [...list].sort((a, b) => {
    const liveDiff = Number(b.isLive) - Number(a.isLive)
    if (liveDiff !== 0) {
      return liveDiff
    }

    const favoriteDiff = Number(favorites.has(b.id)) - Number(favorites.has(a.id))
    if (favoriteDiff !== 0) {
      return favoriteDiff
    }

    return a.username.localeCompare(b.username, undefined, { sensitivity: 'base' })
  })
}

export function filterStreamers(
  list: Streamer[],
  query: string,
  onlyFavorites: boolean,
  favorites: Set<string>,
): Streamer[] {
  const normalized = query.trim().toLowerCase()

  return list.filter((streamer) => {
    if (onlyFavorites && !favorites.has(streamer.id)) {
      return false
    }

    if (!normalized) {
      return true
    }

    return streamer.username.toLowerCase().includes(normalized)
  })
}

export function pageCount(total: number, pageSize = PAGE_SIZE): number {
  return Math.max(1, Math.ceil(total / pageSize))
}

export function paginate<T>(list: T[], page: number, pageSize = PAGE_SIZE): T[] {
  const start = (page - 1) * pageSize
  return list.slice(start, start + pageSize)
}
