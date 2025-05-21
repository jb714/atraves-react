import { useState } from "react"
import Map from "./Map"
import LocationInputContainer from "./LocationInputContainer"
import Messages from "./Messages"
import { calculateAntipode } from "../utils/locationUtils"
import { useToast } from "@chakra-ui/react"
import { Grid, GridItem, Text, Box } from "@chakra-ui/react"
import { useTranslation } from "react-i18next"

const ContentWrapper = () => {
    const { t } = useTranslation()
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [address, setAddress] = useState('')
    const toast = useToast()

    // Convert string coordinates to numbers, with fallback to default values
    const getMapCoordinates = () => {
        const lat = parseFloat(latitude)
        const lng = parseFloat(longitude)
        
        // Return default coordinates (Los Angeles)
        if (isNaN(lat) || isNaN(lng)) {
            return { lat: 34.0522, lng: -118.2437 }
        }
        
        return { lat, lng }
    }

    const coordinates = getMapCoordinates()
    
    // Calculate antipode coordinates with error handling
    const getAntipodeCoordinates = () => {
        try {
            return calculateAntipode(coordinates.lat, coordinates.lng)
        } catch (error) {
            // Show error toast if calculation fails
            toast({
                title: t('errors.antipode.title'),
                description: t('errors.antipode.description', { message: error instanceof Error ? error.message : "Invalid coordinates" }),
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            // Return default antipode coordinates (Antipode of Los Angeles)
            return { lat: -34.0522, lng: 61.7563 }
        }
    }

    const antipodeCoordinates = getAntipodeCoordinates()

    return (
        <Box px={[2, 4, 6]}>
            <LocationInputContainer 
                latitude={latitude}
                setLatitude={setLatitude}
                longitude={longitude}
                setLongitude={setLongitude}
                address={address}
                setAddress={setAddress}
            />
            <Box my={[4, 6, 8]} />
            <Grid 
                templateColumns={["1fr", "1fr", "repeat(2, 1fr)"]} 
                gap={[2, 4, 6]}
            >
                <GridItem>
                    <Box mb={2}>
                        <Text fontSize={["md", "lg"]} fontWeight="medium">
                            {t('location.original')}
                        </Text>
                        <Text fontSize={["xs", "sm"]} color="gray.600">
                            {latitude && longitude ? 
                                `(${parseFloat(latitude).toFixed(4)}°, ${parseFloat(longitude).toFixed(4)}°)` : 
                                t('location.defaultLocation')}
                        </Text>
                    </Box>
                    <div id="UserMap" className="map-container">
                        <Map lat={coordinates.lat} lng={coordinates.lng}/>
                    </div>
                </GridItem>
                <GridItem>
                    <Box mb={2}>
                        <Text fontSize={["md", "lg"]} fontWeight="medium">
                            {t('location.antipode')}
                        </Text>
                        <Text fontSize={["xs", "sm"]} color="gray.600">
                            {latitude && longitude ? 
                                `(${antipodeCoordinates.lat.toFixed(4)}°, ${antipodeCoordinates.lng.toFixed(4)}°)` : 
                                t('location.defaultAntipode')}
                        </Text>
                    </Box>
                    <div id="AntipodeMap" className="map-container">
                        <Map lat={antipodeCoordinates.lat} lng={antipodeCoordinates.lng}/>
                    </div>
                </GridItem>
            </Grid>
            <Messages 
                currentLat={coordinates.lat}
                currentLng={coordinates.lng}
                antipodeLat={antipodeCoordinates.lat}
                antipodeLng={antipodeCoordinates.lng}
            />
        </Box>
    )
}

export default ContentWrapper