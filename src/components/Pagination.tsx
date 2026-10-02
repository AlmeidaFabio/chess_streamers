type PaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  const isFirst = page <= 1
  const isLast = page >= pageCount

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-4"
      aria-label="Paginação"
    >
      <button
        type="button"
        className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => onPageChange(page - 1)}
        disabled={isFirst}
        aria-label="Página anterior"
      >
        Anterior
      </button>
      <p className="min-w-32 text-center text-sm text-zinc-400" aria-live="polite">
        Página {page} de {pageCount}
      </p>
      <button
        type="button"
        className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => onPageChange(page + 1)}
        disabled={isLast}
        aria-label="Próxima página"
      >
        Próxima
      </button>
    </nav>
  )
}
