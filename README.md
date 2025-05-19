# Atraves - The Other Side of The World, Here

A React application that allows users to find the antipode (opposite point on Earth) of any location. Users can input coordinates or an address, and the application will display both the original location and its antipode on separate maps.

## Features

- Input location using coordinates (latitude/longitude) or address
- Real-time map updates as coordinates change
- Automatic geocoding of addresses to coordinates
- Display of both original location and its antipode
- Input validation and error handling
- Responsive design

## Technologies Used

- React
- TypeScript
- Google Maps API
- Chakra UI
- React Google Maps

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/atraves-react.git
cd atraves-react
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Google Maps API keys:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_production_key_here
REACT_APP_TEST_GOOGLE_MAPS_KEY=your_test_key_here
```

4. Start the development server:
```bash
npm start
```

## Environment Variables

- `REACT_APP_GOOGLE_MAPS_API_KEY`: Your Google Maps API key for production
- `REACT_APP_TEST_GOOGLE_MAPS_KEY`: Your Google Maps API key for development

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
