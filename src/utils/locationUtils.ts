export const isValidLatitude = (lat: string): boolean => {
    const num = parseFloat(lat);
    return !isNaN(num) && num >= -90 && num <= 90;
};

export const isValidLongitude = (lng: string): boolean => {
    const num = parseFloat(lng);
    return !isNaN(num) && num >= -180 && num <= 180;
};

export const getApiKey = (): string => {
    if (process.env.NODE_ENV === 'development') {
        return process.env.REACT_APP_TEST_GOOGLE_MAPS_KEY || '';
    }
    return process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
};

/**
 * Calculates the antipode (opposite point on Earth) for given coordinates
 * @param lat - Latitude in degrees (-90 to 90)
 * @param lng - Longitude in degrees (-180 to 180)
 * @returns Object containing antipode coordinates
 * @throws Error if coordinates are invalid
 */
export const calculateAntipode = (lat: number, lng: number): { lat: number; lng: number } => {
    // Validate input coordinates
    if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid coordinates: latitude and longitude must be numbers');
    }

    if (lat < -90 || lat > 90) {
        throw new Error('Invalid latitude: must be between -90 and 90 degrees');
    }

    if (lng < -180 || lng > 180) {
        throw new Error('Invalid longitude: must be between -180 and 180 degrees');
    }

    // Normalize longitude to -180 to 180 range
    let normalizedLng = lng;
    while (normalizedLng > 180) normalizedLng -= 360;
    while (normalizedLng < -180) normalizedLng += 360;

    // Calculate opposite latitude (simply negate the value)
    const oppLat = -lat;
    
    // Calculate opposite longitude
    // If longitude is positive, subtract 180
    // If longitude is negative, add 180
    const oppLng = normalizedLng > 0 ? normalizedLng - 180 : normalizedLng + 180;

    // Normalize the result to ensure it's within valid ranges
    return {
        lat: Math.max(-90, Math.min(90, oppLat)), // Clamp to -90 to 90
        lng: oppLng > 180 ? oppLng - 360 : oppLng // Normalize to -180 to 180
    };
};

export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
        // Call our secure Cloud Function HTTP endpoint
        const functionUrl = process.env.REACT_APP_GEOCODE_FUNCTION_URL ||
                          'https://us-central1-jb-apps-1d33e.cloudfunctions.net/geocode';

        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Geocoding error:", error);
            return null;
        }

        const data = await response.json();

        if (data.success && data.coordinates) {
            return data.coordinates;
        }

        return null;
    } catch (error: any) {
        console.error("Geocoding error:", error);

        // Log more details for debugging
        if (error.message) {
            console.error("Error message:", error.message);
        }

        return null;
    }
}; 