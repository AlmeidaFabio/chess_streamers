const STORAGE_KEY = 'chess-streamers:favorites'

export function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return new Set()
    }

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return new Set()
    }

    return new Set(parsed.filter((id): id is string => typeof id === 'string'))
  } catch {
    return new Set()
  }
}

export function writeFavorites(favorites: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]))
}
