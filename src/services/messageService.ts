import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    orderBy, 
    limit,
    Timestamp,
    GeoPoint,
    writeBatch,
    doc,
    FirestoreError,
    enableIndexedDbPersistence
} from 'firebase/firestore';
import { db } from '../firebase';
import { Message, MessageInput, MessageQuery } from '../types';

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
    }
});

// Collection reference
const messagesCollection = collection(db, 'messages');

// Cache for messages
const messageCache = new Map<string, { messages: Message[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper to calculate bounding box
function getBoundingBox(lat: number, lng: number, radiusKm: number) {
    const earthRadius = 6371; // km
    const latDelta = (radiusKm / earthRadius) * (180 / Math.PI);
    const lngDelta = (radiusKm / earthRadius) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
    return {
        minLat: lat - latDelta,
        maxLat: lat + latDelta,
        minLng: lng - lngDelta,
        maxLng: lng + lngDelta
    };
}

// Create a new message
export const createMessage = async (messageInput: MessageInput): Promise<string> => {
    try {
        console.log('Creating message:', messageInput);
        const docRef = await addDoc(messagesCollection, {
            ...messageInput,
            timestamp: Timestamp.now(),
            // Store both GeoPoint and separate lat/lng fields
            location: new GeoPoint(messageInput.location.lat, messageInput.location.lng),
            locationLat: messageInput.location.lat,
            locationLng: messageInput.location.lng
        });
        console.log('Message created with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error creating message:', error);
        if (error instanceof FirestoreError) {
            throw new Error(`Firestore error: ${error.code} - ${error.message}`);
        }
        throw error;
    }
};

// Create messages at both locations
export const createMessagesAtBothLocations = async (
    message: string,
    currentLocation: { lat: number, lng: number },
    antipodeLocation: { lat: number, lng: number },
    language: string
): Promise<void> => {
    try {
        console.log('Creating messages at locations:', {
            current: currentLocation,
            antipode: antipodeLocation
        });

        const batch = writeBatch(db);
        
        // Create message at current location
        const currentDocRef = doc(messagesCollection);
        const currentMessageData = {
            content: message,
            location: new GeoPoint(currentLocation.lat, currentLocation.lng),
            locationLat: currentLocation.lat,
            locationLng: currentLocation.lng,
            timestamp: Timestamp.now(),
            language,
            isAntipode: false
        };
        console.log('Creating message at current location:', currentMessageData);
        batch.set(currentDocRef, currentMessageData);

        // Create message at antipode
        const antipodeDocRef = doc(messagesCollection);
        const antipodeMessageData = {
            content: message,
            location: new GeoPoint(antipodeLocation.lat, antipodeLocation.lng),
            locationLat: antipodeLocation.lat,
            locationLng: antipodeLocation.lng,
            timestamp: Timestamp.now(),
            language,
            isAntipode: true
        };
        console.log('Creating message at antipode:', antipodeMessageData);
        batch.set(antipodeDocRef, antipodeMessageData);

        // Commit both writes in a single batch
        await batch.commit();
        console.log('Messages created successfully');
    } catch (error) {
        console.error('Error creating messages:', error);
        if (error instanceof FirestoreError) {
            console.error('Firestore error details:', {
                code: error.code,
                message: error.message,
                name: error.name
            });
            throw new Error(`Firestore error: ${error.code} - ${error.message}`);
        }
        throw error;
    }
};

// Get messages near a location
export const getMessagesNearLocation = async (queryParams: MessageQuery): Promise<Message[]> => {
    // Increase radius for debugging
    const { location, radius = 20, limit: limitCount = 10 } = queryParams;
    try {
        console.log('Getting messages near location:', location);
        const cacheKey = `${location.lat.toFixed(4)}_${location.lng.toFixed(4)}_${radius}_${limitCount}`;
        const cached = messageCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            console.log('Returning cached messages');
            return cached.messages;
        }

        // Calculate bounding box
        const bounds = getBoundingBox(location.lat, location.lng, radius);
        console.log('Bounding box:', bounds);

        // Query for messages within bounding box using locationLat and locationLng
        const q = query(
            messagesCollection,
            where('locationLat', '>=', bounds.minLat),
            where('locationLat', '<=', bounds.maxLat),
            where('locationLng', '>=', bounds.minLng),
            where('locationLng', '<=', bounds.maxLng),
            orderBy('timestamp', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        console.log('Found messages:', querySnapshot.size);

        const messages = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const msg = {
                id: doc.id,
                content: data.content,
                location: {
                    lat: data.locationLat,
                    lng: data.locationLng
                },
                timestamp: data.timestamp.toDate(),
                language: data.language,
                isAntipode: data.isAntipode
            };
            // Debug log for each message
            console.log('Message:', msg);
            return msg;
        });

        messageCache.set(cacheKey, {
            messages,
            timestamp: Date.now()
        });

        return messages;
    } catch (error) {
        console.error('Error getting messages:', error);
        if (error instanceof FirestoreError) {
            console.error('Firestore error details:', {
                code: error.code,
                message: error.message,
                name: error.name
            });
            throw new Error(`Firestore error: ${error.code} - ${error.message}`);
        }
        throw error;
    }
}; 