import { useCallback, useState } from 'react'
import { readFavorites, writeFavorites } from '../lib/favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => readFavorites())

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      writeFavorites(next)
      return next
    })
  }, [])

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites])

  return { favorites, toggleFavorite, isFavorite }
}
