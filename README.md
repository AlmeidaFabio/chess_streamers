# Chess Streamers

Uma aplicação web para descobrir streamers listados pelo Chess.com. A página destaca quem está ao vivo, permite buscar por nome e salvar favoritos, e reúne links de Twitch, YouTube e Kick quando disponíveis.

## Recursos

- Lista obtida da [API pública de streamers do Chess.com](https://api.chess.com/pub/streamers).
- Streamers ao vivo aparecem antes dos offline; dentro de cada grupo, a lista é ordenada pelo nome.
- Busca por nome de usuário e filtro para exibir somente favoritos.
- Favoritos salvos no `localStorage` do navegador.
- Paginação no cliente, com 15 streamers por página.
- Links para Twitch, YouTube e Kick quando informados pela API.
- Atualização automática a cada 60 segundos enquanto a página está visível, com opção de atualizar manualmente.
- Estados de carregamento, erro e avatar indisponível.
- Interface responsiva em português.

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Node.js test runner (`node:test`)

## Requisitos

- Node.js compatível com Vite 8 e com `--experimental-strip-types` (Node.js 22.6 ou superior recomendado).
- npm.

## Começar

Instale as dependências:

```bash
npm install
```

O servidor de desenvolvimento do Vite encaminha `/api/chess` para `https://api.chess.com/pub`. Assim, o cliente requisita `/api/chess/streamers` por meio do proxy.

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra o endereço local impresso pelo Vite no terminal.

## Comandos

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite. |
| `npm run build` | Verifica os tipos TypeScript e gera a versão de produção em `dist/`. |
| `npm run preview` | Serve localmente a versão de produção já compilada. |
| `npm test` | Executa os testes automatizados com o test runner nativo do Node. |
| `npm run lint` | Executa o Oxlint. |

## Testes

Execute a suíte com:

```bash
npm test
```

Os testes cobrem ordenação, prioridade de favoritos, busca, filtro combinado, paginação e mapeamento das URLs de plataforma.

## Estrutura do projeto

```text
src/
├── api/                 # Tipos, busca e mapeamento da resposta do Chess.com
├── components/          # Cards, lista, paginação, status e controles
├── hooks/               # Estado de favoritos
├── lib/                 # Ordenação, filtros, paginação e persistência
├── App.tsx               # Estado e composição principal da aplicação
└── main.tsx              # Entrada React
tests/
└── streamers.test.mjs    # Testes das funções de dados
docs/
├── braindump.md          # Ideia e requisitos originais
└── plan.md               # Plano e critérios de aceite
```

## Dados e limitações

- A API retorna a coleção sem paginação; filtro, ordenação e páginas são calculados no navegador.
- Os links de plataforma são obtidos de `platforms` na resposta. `twitch_url` só é usado como fallback quando contém um endereço Twitch.
- O proxy está configurado no servidor de desenvolvimento do Vite. Um deploy de produção precisa de uma estratégia própria para acessar a API.
- Os favoritos são locais ao navegador e não são sincronizados entre dispositivos.

## Deploy no GitHub Pages

O workflow `.github/workflows/deploy.yml` publica o app quando há push para `main` e também atualiza a lista em uma agenda periódica. Antes de gerar o site, ele busca os dados da API e grava `public/streamers.json`; em produção, o app carrega esse arquivo estático, já que GitHub Pages não executa o proxy de desenvolvimento.

No repositório, habilite **Settings → Pages → Build and deployment → Source → GitHub Actions**. O endereço do projeto é `https://almeidafabio.github.io/chess_streamers/`. As execuções agendadas do GitHub Actions podem sofrer atrasos, então a atualização não é garantida no segundo exato do intervalo.

## Licença

Nenhuma licença foi definida para este projeto ainda.
