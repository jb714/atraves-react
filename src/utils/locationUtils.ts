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
    const apiKey = getApiKey();
    
    if (!apiKey) {
        console.error('Google Maps API key is not configured');
        return null;
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                address
            )}&key=${apiKey}`
        );
        const data = await response.json();

        if (data.status === "OK" && data.results[0]) {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng };
        }
        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}; 