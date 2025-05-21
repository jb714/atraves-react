# Atraves - The Other Side of The World, Here

A React application that allows users to find the antipode (opposite point on Earth) of any location. Users can input coordinates or an address, and the application will display both the original location and its antipode on separate maps.

## Features

- Input location using coordinates (latitude/longitude) or address
- Real-time map updates as coordinates change
- Automatic geocoding of addresses to coordinates
- Display of both original location and its antipode
- Input validation and error handling
- Responsive design
- Message in a Bottle feature to leave messages at antipodes

## Technologies Used

- React
- TypeScript
- Google Maps API
- Chakra UI
- React Google Maps
- Firebase (Firestore)

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

3. Create a `.env` file in the root directory with your API keys:

For Google Maps:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_production_key_here
REACT_APP_TEST_GOOGLE_MAPS_KEY=your_test_key_here
```

For Firebase:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Set up Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database
   - Add a web app to your project
   - Copy the Firebase configuration values to your `.env` file
   - Deploy Firestore security rules (see `firestore.rules`)

5. Start the development server:
```bash
npm start
```

## Environment Variables

### Google Maps
- `REACT_APP_GOOGLE_MAPS_API_KEY`: Your Google Maps API key for production
- `REACT_APP_TEST_GOOGLE_MAPS_KEY`: Your Google Maps API key for development

### Firebase
- `REACT_APP_FIREBASE_API_KEY`: Your Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `REACT_APP_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID`: Your Firebase app ID

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
