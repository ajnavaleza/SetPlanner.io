# SetPlanner Backend

This is the backend server for SetPlanner, handling WebSocket connections, DJ authentication, and song voting system.

## Environment Variables

Required environment variables:
```
NODE_ENV=production
CLIENT_URL=https://set-planner-io.vercel.app
JWT_SECRET=your-secret-key
DJ_PASSWORD_HASH=your-dj-password-hash
PORT=3001 (optional, defaults to 3001)
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Production

1. Install dependencies:
```bash
npm install --production
```

2. Start production server:
```bash
npm start
```

## API Endpoints

- `POST /api/auth/dj/login` - DJ authentication
- `GET /api/spotify/search` - Search for songs

## WebSocket Events

- `authenticate` - Authenticate DJ
- `getSystemStatus` - Get current voting system status
- `setSystemStatus` - Enable/disable voting system (DJ only)
- `suggestSong` - Suggest a song
- `voteSong` - Vote for a song
- `removeSong` - Remove a song (DJ only) 