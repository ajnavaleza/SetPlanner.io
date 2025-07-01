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
