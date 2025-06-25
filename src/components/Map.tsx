import { GoogleMap, useLoadScript, Marker, useGoogleMap } from "@react-google-maps/api";
import { getApiKey } from "../utils/locationUtils";
import { useEffect } from "react";
import { atravesMapStyles, antipodeMapStyles } from "../utils/mapStyles";
import { Box, Spinner, VStack, Text } from "@chakra-ui/react";

const containerStyle = {
    width: '100%',
    height: '400px'
}

type MapProps = {
    lat: number
    lng: number
    isAntipode?: boolean
}

// Component to handle map updates
const MapUpdater = ({ lat, lng }: MapProps) => {
    const map = useGoogleMap();
    
    useEffect(() => {
        if (map) {
            map.panTo({ lat, lng });
        }
    }, [map, lat, lng]);

    return null;
};

const Map = ({ lat, lng, isAntipode = false }: MapProps) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: getApiKey()
    })

    const center = { lat, lng }
    const mapStyles = isAntipode ? antipodeMapStyles : atravesMapStyles

    if (loadError) {
        return (
            <Box 
                height="400px" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                bg="gray.50"
                borderRadius="md"
            >
                <VStack>
                    <Text color="red.500" fontWeight="medium">
                        Failed to load map
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        Please check your internet connection
                    </Text>
                </VStack>
            </Box>
        )
    }

    if (!isLoaded) {
        return (
            <Box 
                height="400px" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                bg="gray.50"
                borderRadius="md"
            >
                <VStack spacing={3}>
                    <Spinner 
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="xl"
                    />
                    <Text color="gray.600" fontWeight="medium">
                        Loading map...
                    </Text>
                </VStack>
            </Box>
        )
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            options={{
                styles: mapStyles,
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: true
            }}
        >
            <Marker 
                position={center}
                icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: isAntipode ? '#0d9488' : '#1e40af',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    scale: 8,
                }}
            />
            <MapUpdater lat={lat} lng={lng} />
        </GoogleMap>
    )
}

export default Map;