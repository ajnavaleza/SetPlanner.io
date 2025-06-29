import { NextApiRequest, NextApiResponse } from 'next';
import SpotifyWebApi from 'spotify-web-api-node';

// Mock data for fallback
const mockTracks = [
  {
    id: '1',
    name: 'Example Track 1',
    artist: 'Artist 1',
    duration: 3,
    popularity: 85,
    preview_url: 'https://example.com/preview1.mp3'
  },
  {
    id: '2',
    name: 'Example Track 2',
    artist: 'Artist 2',
    duration: 4,
    popularity: 75,
    preview_url: 'https://example.com/preview2.mp3'
  }
];

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

async function getAccessToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
    return true;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    return false;
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { description, genre, referenceArtists, length } = req.body;
    
    if (!genre) {
      return res.status(400).json({ error: 'Genre is required' });
    }

    // Return mock data for now
    return res.status(200).json({
      plan: {
        genre,
        description,
        total_duration: length,
        tracks: mockTracks,
        enhanced: false
      }
    });

  } catch (error) {
    console.error('Error generating set plan:', error);
    return res.status(500).json({ error: 'Failed to generate set plan' });
  }
} 