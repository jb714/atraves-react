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
        <Box px={[3, 4, 6]} pt={[6, 8]} pb={[6, 8]}>
            <LocationInputContainer 
                latitude={latitude}
                setLatitude={setLatitude}
                longitude={longitude}
                setLongitude={setLongitude}
                address={address}
                setAddress={setAddress}
            />
            <Box my={[3, 4, 6]} />
            <Grid 
                templateColumns={["1fr", "1fr", "repeat(2, 1fr)"]} 
                gap={[2, 4, 6]}
            >
                <GridItem>
                    <Box
                        bg="white"
                        borderRadius="12px"
                        p={[3, 4]}
                        boxShadow="sm"
                        border="1px solid"
                        borderColor="gray.100"
                    >
                        <Box mb={3}>
                            <Text fontSize={["md", "lg"]} fontWeight="medium">
                                🌍 {t('location.original')}
                            </Text>
                            <Text fontSize="xs" color="gray.600" lineHeight="1.3">
                                {latitude && longitude ? 
                                    `(${parseFloat(latitude).toFixed(4)}°, ${parseFloat(longitude).toFixed(4)}°)` : 
                                    t('location.defaultLocation')}
                            </Text>
                        </Box>
                        <Box
                            borderRadius="14px"
                            overflow="hidden"
                            border="1px solid"
                            borderColor="gray.200"
                            _hover={{ boxShadow: "md" }}
                            transition="box-shadow 0.2s"
                        >
                            <div id="UserMap" className="map-container" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                <Map lat={coordinates.lat} lng={coordinates.lng}/>
                            </div>
                        </Box>
                    </Box>
                </GridItem>
                <GridItem>
                    <Box
                        bg="white"
                        borderRadius="12px"
                        p={[3, 4]}
                        boxShadow="sm"
                        border="1px solid"
                        borderColor="gray.100"
                    >
                        <Box mb={3}>
                            <Text fontSize={["md", "lg"]} fontWeight="medium">
                                🎯 {t('location.antipode')}
                            </Text>
                            <Text fontSize="xs" color="gray.600" lineHeight="1.3">
                                {latitude && longitude ? 
                                    `(${antipodeCoordinates.lat.toFixed(4)}°, ${antipodeCoordinates.lng.toFixed(4)}°)` : 
                                    t('location.defaultAntipode')}
                            </Text>
                        </Box>
                        <Box
                            borderRadius="14px"
                            overflow="hidden"
                            border="1px solid"
                            borderColor="gray.200"
                            _hover={{ boxShadow: "md" }}
                            transition="box-shadow 0.2s"
                        >
                            <div id="AntipodeMap" className="map-container" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                <Map lat={antipodeCoordinates.lat} lng={antipodeCoordinates.lng}/>
                            </div>
                        </Box>
                    </Box>
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