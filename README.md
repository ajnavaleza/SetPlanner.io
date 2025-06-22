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
│   ├── pages/
│   │   ├── CreateSetPlan.jsx
│   │   └── LandingPage.tsx
│   ├── App.tsx          # Main application component
│   ├── index.js         # Application entry point
│   └── index.css        # Global styles
├── api/                 # API routes (serverless functions)
│   ├── auth/
│   │   └── spotify/     # Spotify authentication
│   ├── spotify/
│   │   └── create-playlist.js
│   └── set-plan.js      # Main set planning endpoint
├── public/              # Static assets
├── server.js            # Development server
└── package.json         # Dependencies
```

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/ajnavaleza/setplanner.io.git
   cd setplanner.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/spotify/callback
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   
   This will start both the React development server (port 3000) and the API server (port 3001) concurrently.

   Alternatively, you can run them separately:
   ```bash
   # Terminal 1 - React app
   npm start
   
   # Terminal 2 - API server
   npm run server
   ```

## Deployment

### Vercel Deployment

The application is deployed on Vercel as a full-stack app with serverless functions:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure the build settings:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Add your environment variables in the Vercel dashboard
5. Deploy using the Vercel CLI:
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
  - Vercel Serverless Functions (production)
  - Express.js (development)
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
