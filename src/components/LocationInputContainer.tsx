import { useState, useEffect } from "react";
import LocationInput from "./LocationInput";
import { Select, Text, useToast } from "@chakra-ui/react";
import { isValidLatitude, isValidLongitude, geocodeAddress } from "../utils/locationUtils";

type InputMode = "coordinates" | "address";

type LocationInputContainerProps = {
    latitude: string;
    setLatitude: (latitude: string) => void;
    longitude: string;
    setLongitude: (longitude: string) => void;
    address?: string;
    setAddress?: (address: string) => void;
}

const LocationInputContainer = ({
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    address = "",
    setAddress = () => {}
}: LocationInputContainerProps) => {
    const [inputMode, setInputMode] = useState<InputMode>("coordinates");
    const [isGeocoding, setIsGeocoding] = useState(false);
    const toast = useToast();

    // Validate coordinates
    const validateCoordinates = () => {
        if (!isValidLatitude(latitude)) {
            toast({
                title: "Invalid Latitude",
                description: "Latitude must be between -90 and 90 degrees",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
        if (!isValidLongitude(longitude)) {
            toast({
                title: "Invalid Longitude",
                description: "Longitude must be between -180 and 180 degrees",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
        return true;
    };

    // Handle address changes and geocoding
    useEffect(() => {
        const handleAddressChange = async () => {
            if (inputMode === "address" && address) {
                setIsGeocoding(true);
                const coords = await geocodeAddress(address);
                setIsGeocoding(false);

                if (coords) {
                    setLatitude(coords.lat.toString());
                    setLongitude(coords.lng.toString());
                } else {
                    toast({
                        title: "Geocoding Failed",
                        description: "Could not find coordinates for this address",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            }
        };

        const timeoutId = setTimeout(handleAddressChange, 1000); // Debounce for 1 second
        return () => clearTimeout(timeoutId);
    }, [address, inputMode, setLatitude, setLongitude, toast]);

    return (
        <>
            <Select 
                value={inputMode}
                onChange={(e) => setInputMode(e.target.value as InputMode)}
                mb={4}
            >
                <option value="coordinates">Enter Coordinates</option>
                <option value="address">Enter Address</option>
            </Select>

            {inputMode === "coordinates" ? (
                <>
                    <LocationInput 
                        label="Enter Latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        onBlur={validateCoordinates}
                        placeholder="e.g., 34.0522"
                    />
                    <LocationInput 
                        label="Enter Longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        onBlur={validateCoordinates}
                        placeholder="e.g., -118.2437"
                    />
                </>
            ) : (
                <>
                    <LocationInput 
                        label="Enter Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g., Los Angeles, CA"
                    />
                    {isGeocoding && (
                        <Text fontSize="sm" color="gray.500" mt={2}>
                            Converting address to coordinates...
                        </Text>
                    )}
                </>
            )}
        </>
    )
}

export default LocationInputContainer