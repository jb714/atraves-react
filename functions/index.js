const {onRequest} = require('firebase-functions/v2/https');
const fetch = require('node-fetch');

/**
 * Geocode an address to coordinates
 * This function acts as a secure proxy to the Google Geocoding API
 */
exports.geocode = onRequest({cors: true}, async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method not allowed'});
    return;
  }

  const { address } = req.body;

  // Validate input
  if (!address || typeof address !== 'string') {
    res.status(400).json({error: 'Address parameter is required and must be a string'});
    return;
  }

  if (address.trim().length === 0) {
    res.status(400).json({error: 'Address cannot be empty'});
    return;
  }

  // Get the API key from environment variable
  const apiKey = process.env.GEOCODING_API_KEY;

  if (!apiKey) {
    console.error('GEOCODING_API_KEY not configured');
    res.status(500).json({error: 'Geocoding service is not configured'});
    return;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      res.json({
        success: true,
        coordinates: { lat, lng }
      });
    } else if (data.status === 'ZERO_RESULTS') {
      res.status(404).json({error: 'No results found for the provided address'});
    } else {
      console.error('Geocoding API error:', data.status, data.error_message);
      res.status(500).json({error: `Geocoding failed: ${data.status}`});
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({error: 'Failed to geocode address'});
  }
});
