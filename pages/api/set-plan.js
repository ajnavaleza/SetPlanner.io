export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { genre, description, referenceArtists, length } = req.body;

    if (!genre) {
      return res.status(400).json({ error: 'Genre is required' });
    }

    // Mock data for demonstration
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

    const plan = {
      genre,
      description,
      total_duration: length,
      tracks: mockTracks,
      enhanced: false
    };

    res.status(200).json({ plan });
  } catch (error) {
    console.error('Error generating set plan:', error);
    res.status(500).json({ error: 'Failed to generate set plan' });
  }
} 