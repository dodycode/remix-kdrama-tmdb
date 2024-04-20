# Remix TMDB (The Movie Database) KDRAMA List

List of KDRAMA from TMDB API. Made with Remix, and NextUI. For practice purpose only.

## Getting Started

```sh
npm install
```

## Environment Variables

Create a `wrangler.toml` file in the root of the project and add the following:

```toml
[vars]
THE_MOVIE_DB_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
```

## Development

Run the Vite dev server:

```sh
npm run dev
```

To run Wrangler:

```sh
npm run build
npm run start
```

## Deployment 

To deploy to Cloudflare Workers:

```sh
npm run build && npm run deploy
```
