# SetPlanner.io

A web application that helps DJs plan their sets using Spotify's API and AI assistance. Create dynamic DJ sets with intelligent track selection and seamless transitions.

## Features

- 🎵 Create AI-assisted DJ sets
- 🎧 Integration with Spotify API for track selection
- 🎸 Genre-based track recommendations
- 📈 Intelligent set structure planning (Intro, Build, Peak, Outro)
- 🔊 Audio preview functionality
- 🎨 Modern, responsive UI with Tailwind CSS

## Project Structure

```
setplanner.io/
├── src/
│   ├── components/
│   │   └── ui/          # Reusable UI components
│   ├── pages/
│   │   ├── CreateSetPlan.jsx
│   │   └── LandingPage.tsx
│   ├── lib/
│   │   └── utils.ts     # Utility functions
│   ├── App.tsx          # Main application component
│   ├── index.js         # Application entry point
│   └── index.css        # Global styles
├── server/
│   ├── routes/
│   │   └── setPlanner.js
│   ├── services/
│   │   ├── openaiService.js
│   │   └── spotifyService.js
│   └── index.js         # Server entry point
├── public/              # Static assets
├── package.json         # Client dependencies
└── server/package.json  # Server dependencies
```

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/ajnavaleza/setplanner.io.git
   cd setplanner.io
   ```

2. Install dependencies:
   ```bash
   npm install        # Client dependencies
   cd server && npm install  # Server dependencies
   ```

3. Create a `.env` file in the server directory:
   ```
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

4. Start the development servers:
   ```bash
   # Terminal 1 - Client
   npm start          # Runs on http://localhost:3000

   # Terminal 2 - Server
   cd server && npm start  # Runs on http://localhost:5001
   ```

## Deployment

### Client (Vercel)

The frontend is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure the build settings:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`

### Server (Vercel)

The backend is deployed as serverless functions:

1. Ensure your `vercel.json` is configured correctly
2. Add your environment variables in the Vercel dashboard
3. Deploy using the Vercel CLI:
   ```bash
   vercel
   ```

## Technologies

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - React Router DOM

- **Backend**
  - Node.js
  - Express
  - Spotify Web API
  - OpenAI API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
