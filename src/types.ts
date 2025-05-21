// Location type for message coordinates
export interface Location {
    lat: number;
    lng: number;
}

// Message type for the bottle messages
export interface Message {
    id?: string;           // Firestore document ID
    content: string;       // The message content
    location: Location;    // Where the message was left
    timestamp: Date;       // When the message was created
    language?: string;     // Language of the message (optional)
    isAntipode?: boolean;  // Whether this is the antipode location (optional)
}

// Message creation type (without id and timestamp)
export interface MessageInput {
    content: string;
    location: Location;
    language?: string;
    isAntipode?: boolean;
}

// Message query parameters
export interface MessageQuery {
    location: Location;
    radius?: number;       // Search radius in kilometers (optional)
    limit?: number;        // Maximum number of messages to return (optional)
} 