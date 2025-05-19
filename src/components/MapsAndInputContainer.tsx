import { useState } from "react"
import Map from "./Map"
import LocationInputContainer from "./LocationInputContainer"
import { calculateAntipode } from "../utils/locationUtils"
import { useToast } from "@chakra-ui/react"

const MapsSection = () => {
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [address, setAddress] = useState('')
    const toast = useToast()

    // Convert string coordinates to numbers, with fallback to default values
    const getMapCoordinates = () => {
        const lat = parseFloat(latitude)
        const lng = parseFloat(longitude)
        
        // Return default coordinates (Los Angeles) if coordinates are invalid
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
                title: "Error calculating antipode",
                description: error instanceof Error ? error.message : "Invalid coordinates",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            // Return default coordinates if calculation fails
            return { lat: -34.0522, lng: 61.7563 } // Antipode of Los Angeles
        }
    }

    const antipodeCoordinates = getAntipodeCoordinates()

    return (
        <div>
            <div id="UserMap" className="map-container">
                <LocationInputContainer 
                    latitude={latitude}
                    setLatitude={setLatitude}
                    longitude={longitude}
                    setLongitude={setLongitude}
                    address={address}
                    setAddress={setAddress}
                />
                <Map lat={coordinates.lat} lng={coordinates.lng}/>
            </div>
            <div id="AntipodeMap" className="map-container">
                <Map lat={antipodeCoordinates.lat} lng={antipodeCoordinates.lng}/>
            </div>
        </div>
    )
}

export default MapsSection