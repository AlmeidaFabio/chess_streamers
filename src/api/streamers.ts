export type StreamerPlatform = {
  type: string
  stream_url?: string
  channel_url?: string
  is_live: boolean
  is_main_live_platform?: boolean
}

export type ApiStreamer = {
  username: string
  avatar?: string
  twitch_url?: string
  url: string
  is_live: boolean
  is_community_streamer: boolean
  platforms?: StreamerPlatform[]
}

export type StreamersResponse = {
  streamers: ApiStreamer[]
}

export type Streamer = {
  id: string
  username: string
  avatar?: string
  twitchUrl?: string
  youtubeUrl?: string
  kickUrl?: string
  chessUrl: string
  isLive: boolean
}

function resolveTwitchUrl(raw: ApiStreamer): string | undefined {
  const twitch = raw.platforms?.find((platform) => platform.type === 'twitch')
  const fromPlatform = twitch?.channel_url ?? twitch?.stream_url
  if (fromPlatform) {
    return fromPlatform
  }

  if (raw.twitch_url && /twitch\.tv/i.test(raw.twitch_url)) {
    return raw.twitch_url
  }

  return undefined
}

function resolvePlatformUrl(raw: ApiStreamer, type: 'youtube' | 'kick'): string | undefined {
  const platform = raw.platforms?.find((item) => item.type.toLowerCase() === type)
  return platform?.channel_url ?? platform?.stream_url
}

export function mapStreamer(raw: ApiStreamer): Streamer {
  return {
    id: raw.username,
    username: raw.username,
    avatar: raw.avatar,
    twitchUrl: resolveTwitchUrl(raw),
    youtubeUrl: resolvePlatformUrl(raw, 'youtube'),
    kickUrl: resolvePlatformUrl(raw, 'kick'),
    chessUrl: raw.url,
    isLive: raw.is_live,
  }
}

export async function fetchStreamers(): Promise<Streamer[]> {
  const response = await fetch('/api/chess/streamers', {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Não foi possível carregar os streamers (${response.status}).`)
  }

  const data = (await response.json()) as StreamersResponse
  if (!Array.isArray(data.streamers)) {
    throw new Error('Resposta inesperada da API do Chess.com.')
  }

  return data.streamers.map(mapStreamer)
}
