import assert from 'node:assert/strict'
import test from 'node:test'
import { mapStreamer } from '../src/api/streamers.ts'
import { filterStreamers, pageCount, paginate, sortStreamers } from '../src/lib/streamers.ts'

const streamers = [
  { id: 'offline', username: 'OfflinePlayer', isLive: false },
  { id: 'live-b', username: 'LiveBeta', isLive: true },
  { id: 'live-a', username: 'LiveAlpha', isLive: true },
]

test('ordena lives antes de offline e usa ordem alfabética nos empates', () => {
  assert.deepEqual(
    sortStreamers(streamers).map(({ id }) => id),
    ['live-a', 'live-b', 'offline'],
  )
})

test('prioriza favoritos entre streamers com o mesmo status', () => {
  assert.deepEqual(
    sortStreamers(streamers, new Set(['live-b'])).map(({ id }) => id),
    ['live-b', 'live-a', 'offline'],
  )
})

test('filtra nome sem diferenciar maiúsculas e espaços externos', () => {
  assert.deepEqual(
    filterStreamers(streamers, '  lIvEa  ', false, new Set()).map(({ id }) => id),
    ['live-a'],
  )
})

test('combina filtro de favoritos com a busca', () => {
  assert.deepEqual(
    filterStreamers(streamers, 'live', true, new Set(['live-b', 'offline'])).map(({ id }) => id),
    ['live-b'],
  )
})

test('calcula páginas e fatia a lista no tamanho esperado', () => {
  const items = Array.from({ length: 31 }, (_, index) => index)
  assert.equal(pageCount(items.length, 15), 3)
  assert.deepEqual(paginate(items, 3, 15), [30])
})

test('mapeia URLs de Twitch, YouTube e Kick das plataformas', () => {
  const streamer = mapStreamer({
    username: 'player',
    url: 'https://www.chess.com/member/player',
    is_live: true,
    is_community_streamer: false,
    platforms: [
      { type: 'twitch', channel_url: 'https://twitch.tv/player', is_live: true },
      { type: 'youtube', channel_url: 'https://youtube.com/@player', is_live: false },
      { type: 'kick', stream_url: 'https://kick.com/player', is_live: false },
    ],
  })

  assert.equal(streamer.twitchUrl, 'https://twitch.tv/player')
  assert.equal(streamer.youtubeUrl, 'https://youtube.com/@player')
  assert.equal(streamer.kickUrl, 'https://kick.com/player')
})

test('ignora twitch_url quando aponta para outra plataforma', () => {
  const streamer = mapStreamer({
    username: 'player',
    twitch_url: 'https://youtube.com/@player',
    url: 'https://www.chess.com/member/player',
    is_live: false,
    is_community_streamer: false,
  })

  assert.equal(streamer.twitchUrl, undefined)
  assert.equal(streamer.youtubeUrl, undefined)
})
