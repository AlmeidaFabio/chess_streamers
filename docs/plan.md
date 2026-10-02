# Plano — Chess Streamers

Lista de streamers do Chess.com, com destaque para quem está ao vivo.

Fonte de requisitos: `docs/braindump.md`.

## Objetivo

Aplicação web que consome `https://api.chess.com/pub/streamers` e exibe streamers com:

- avatar
- nome de usuário
- links das plataformas Twitch, YouTube e Kick quando disponíveis
- status online / offline
- paginação de **15 itens** por página
- streamers **ao vivo primeiro**, depois os offline

## Stack

- React + Vite
- TypeScript
- Tailwind CSS
- Fetch nativo (sem biblioteca de dados nesta versão)

## Estrutura da API

`GET https://api.chess.com/pub/streamers`

Resposta (resumo):

```ts
type Streamer = {
  username: string
  avatar?: string
  twitch_url?: string
  url: string // perfil no Chess.com
  is_live: boolean
  is_community_streamer: boolean
  platforms?: Array<{
    type: string // "twitch" | "youtube" | ...
    stream_url?: string
    channel_url?: string
    is_live: boolean
    is_main_live_platform?: boolean
  }>
}

type StreamersResponse = {
  streamers: Streamer[]
}
```

Observação: `twitch_url` às vezes aponta para YouTube quando a live principal não é Twitch. Na UI, identificar cada link pelo `type` de `platforms` e usar `channel_url` ou `stream_url`. Usar `twitch_url` como fallback apenas quando for um endereço Twitch.

A API **não pagina**. Paginação é no cliente.

CORS: o endpoint público pode bloquear o browser. Usar **proxy do Vite** em desenvolvimento (`/api/chess` → `https://api.chess.com`).

## Arquitetura

```
src/
  api/streamers.ts      // fetch + tipos
  lib/streamers.ts      // sort + paginate
  components/
    StreamerCard.tsx
    StreamerList.tsx
    Pagination.tsx
    StatusBadge.tsx
  App.tsx
  main.tsx
  index.css
```

Fluxo:

1. `App` busca a lista uma vez (loading / erro / sucesso).
2. Ordena: `is_live === true` antes de `false`. Empate: ordem alfabética por `username`.
3. Pagina de 15 em 15.
4. Renderiza cards + controles de página.

## Passos de implementação

### 1. Scaffold

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss @tailwindcss/vite
```

Configurar Tailwind v4 no Vite (`@tailwindcss/vite`) e `index.css` com `@import "tailwindcss"`.

Proxy em `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api/chess': {
      target: 'https://api.chess.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/chess/, '/pub'),
    },
  },
}
```

Cliente chama `/api/chess/streamers`.

### 2. Camada de dados

- Header `Accept: application/json` (a API do Chess.com costuma exigir).
- Validar `response.ok` e lançar erro claro.
- Mapear para um modelo de UI (`id`, `username`, `avatar`, links de plataforma, `chessUrl`, `isLive`).

### 3. Ordenação e paginação

- `PAGE_SIZE = 15`
- `sorted = [...list].sort((a, b) => Number(b.isLive) - Number(a.isLive) || a.username.localeCompare(b.username))`
- `pageCount = Math.ceil(sorted.length / PAGE_SIZE)`
- `slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)`
- Página atual em estado React; resetar para `1` após novo fetch.
- Controles: anterior / próximo, desabilitados nas extremidades; indicador “página X de Y”.

### 4. UI

Layout simples, dark, centralizado:

- Header: título + contagem de lives.
- Grid/lista de cards (avatar, nome, badge Live/Offline e links disponíveis de Twitch, YouTube e Kick em nova aba).
- Avatar com fallback (iniciais) se a imagem falhar.
- Estados: loading (skeleton ou spinner), erro com botão “Tentar de novo”, lista vazia.
- Badge live visível (ex.: ponto vermelho + “Ao vivo”).

### 5. Qualidade

- Componentes tipados; sem `any`.
- Acessibilidade: `alt` no avatar, link com texto visível, botões de paginação com `aria-label`.
- Não persistir página na URL nesta versão (pode ser follow-up).

## Critérios de aceite

- [x] App sobe com Vite + TypeScript + Tailwind.
- [x] Lista vem de `/pub/streamers` (via proxy em dev).
- [x] Cada item mostra avatar, nome, Twitch (quando existir) e status live.
- [x] Cada item mostra links de YouTube e Kick quando disponíveis.
- [x] Lives aparecem antes dos offline.
- [x] Máximo de 15 itens por página; paginação funcional.
- [x] Loading e erro tratados.
- [x] Filtro por nome.
- [x] Favoritos persistidos no navegador.
- [x] Refresh automático.
- [x] Testes automatizados para filtragem, ordenação, paginação e mapeamento das plataformas.

## Fora de escopo (por agora)

- Deploy / proxy de produção.

## Ordem de execução sugerida

1. Scaffold + Tailwind + proxy  
2. Fetch + tipos + estados de loading/erro  
3. Ordenação + paginação  
4. Cards e acabamento visual  
5. Conferir no browser: live no topo, 15 por página, Twitch abre em nova aba  
