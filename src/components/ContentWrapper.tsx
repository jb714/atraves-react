import { useState } from "react"
import Map from "./Map"
import LocationInputContainer from "./LocationInputContainer"
import Messages from "./Messages"
import { calculateAntipode } from "../utils/locationUtils"
import { useToast } from "@chakra-ui/react"
import { Grid, GridItem, Text, Box, Card, CardBody, Container, VStack, HStack } from "@chakra-ui/react"
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
        <Container maxW="1400px" py={8}>
            <VStack spacing={8}>
                {/* Input Section */}
                <Card w="full" variant="elevated">
                    <CardBody p={8}>
                        <LocationInputContainer 
                            latitude={latitude}
                            setLatitude={setLatitude}
                            longitude={longitude}
                            setLongitude={setLongitude}
                            address={address}
                            setAddress={setAddress}
                        />
                    </CardBody>
                </Card>

                {/* Maps Section */}
                <Grid 
                    templateColumns={["1fr", "1fr", "repeat(2, 1fr)"]} 
                    gap={8}
                    w="full"
                >
                    {/* Original Location */}
                    <GridItem>
                        <Card h="full" variant="elevated">
                            <CardBody p={6}>
                                <VStack spacing={4} align="stretch">
                                    <HStack spacing={3} align="center">
                                        <Text fontSize="xl" color="atraves.primary.600">📍</Text>
                                        <VStack align="start" spacing={1}>
                                            <Text fontSize="lg" fontWeight="bold" color="atraves.primary.800">
                                                {t('location.original')}
                                            </Text>
                                            <Text fontSize="sm" color="atraves.neutral.600">
                                                {latitude && longitude ? 
                                                    `(${parseFloat(latitude).toFixed(4)}°, ${parseFloat(longitude).toFixed(4)}°)` : 
                                                    t('location.defaultLocation')}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    <Box 
                                        borderRadius="xl" 
                                        overflow="hidden" 
                                        boxShadow="md"
                                        border="2px solid"
                                        borderColor="atraves.primary.100"
                                    >
                                        <Map lat={coordinates.lat} lng={coordinates.lng} isAntipode={false}/>
                                    </Box>
                                </VStack>
                            </CardBody>
                        </Card>
                    </GridItem>

                    {/* Antipode Location */}
                    <GridItem>
                        <Card h="full" variant="elevated">
                            <CardBody p={6}>
                                <VStack spacing={4} align="stretch">
                                    <HStack spacing={3} align="center">
                                        <Text fontSize="xl" color="atraves.secondary.600">🌍</Text>
                                        <VStack align="start" spacing={1}>
                                            <Text fontSize="lg" fontWeight="bold" color="atraves.secondary.700">
                                                {t('location.antipode')}
                                            </Text>
                                            <Text fontSize="sm" color="atraves.neutral.600">
                                                {latitude && longitude ? 
                                                    `(${antipodeCoordinates.lat.toFixed(4)}°, ${antipodeCoordinates.lng.toFixed(4)}°)` : 
                                                    t('location.defaultAntipode')}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    <Box 
                                        borderRadius="xl" 
                                        overflow="hidden" 
                                        boxShadow="md"
                                        border="2px solid"
                                        borderColor="atraves.secondary.100"
                                    >
                                        <Map lat={antipodeCoordinates.lat} lng={antipodeCoordinates.lng} isAntipode={true}/>
                                    </Box>
                                </VStack>
                            </CardBody>
                        </Card>
                    </GridItem>
                </Grid>

                {/* Messages Section */}
                <Card w="full" variant="elevated">
                    <CardBody p={0}>
                        <Messages 
                            currentLat={coordinates.lat}
                            currentLng={coordinates.lng}
                            antipodeLat={antipodeCoordinates.lat}
                            antipodeLng={antipodeCoordinates.lng}
                        />
                    </CardBody>
                </Card>
            </VStack>
        </Container>
    )
}

export default ContentWrapper