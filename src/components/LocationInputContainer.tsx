import { useState, useEffect } from "react";
import LocationInput from "./LocationInput";
import { Text, useToast, Button, HStack, Grid, GridItem, RadioGroup, Radio, Stack, Divider } from "@chakra-ui/react";
import { isValidLatitude, isValidLongitude, geocodeAddress } from "../utils/locationUtils";
import useDebounce from "../hooks/useDebounce";

type InputMode = "coordinates" | "address" | "place" | "postal" | "landmark";

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
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const toast = useToast();

    // Debounce the inputs
    const debouncedAddress = useDebounce(address, 1000); // 1 second for address
    const debouncedLatitude = useDebounce(latitude, 300); // 300ms for coordinates
    const debouncedLongitude = useDebounce(longitude, 300);

    // Debounce the search query
    const debouncedSearchQuery = useDebounce(searchQuery, 1000);

    // Validate coordinates
    const validateCoordinates = (showToast = true) => {
        // Don't validate if both fields are empty
        if (!debouncedLatitude && !debouncedLongitude) {
            return true;
        }

        // Only show toast for latitude if longitude is empty
        if (debouncedLatitude && !isValidLatitude(debouncedLatitude)) {
            if (showToast) {
                toast({
                    title: "Invalid Latitude",
                    description: "Latitude must be between -90 and 90 degrees",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
            return false;
        }

        // Only show toast for longitude if latitude is empty
        if (debouncedLongitude && !isValidLongitude(debouncedLongitude)) {
            if (showToast) {
                toast({
                    title: "Invalid Longitude",
                    description: "Longitude must be between -180 and 180 degrees",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
            return false;
        }

        // If both coordinates are present, validate both
        if (debouncedLatitude && debouncedLongitude) {
            const isLatValid = isValidLatitude(debouncedLatitude);
            const isLngValid = isValidLongitude(debouncedLongitude);

            if (!isLatValid || !isLngValid) {
                if (showToast) {
                    toast({
                        title: "Invalid Coordinates",
                        description: !isLatValid 
                            ? "Latitude must be between -90 and 90 degrees"
                            : "Longitude must be between -180 and 180 degrees",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
                return false;
            }
        }

        return true;
    };

    // Handle address changes and geocoding
    useEffect(() => {
        const handleAddressChange = async () => {
            if (inputMode === "address" && debouncedAddress) {
                setIsGeocoding(true);
                const coords = await geocodeAddress(debouncedAddress);
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

        handleAddressChange();
    }, [debouncedAddress, inputMode, setLatitude, setLongitude, toast]);

    // Validate coordinates when they change, but don't show toasts
    useEffect(() => {
        if (inputMode === "coordinates") {
            validateCoordinates(false);
        }
    }, [debouncedLatitude, debouncedLongitude, inputMode]);

    // Handle all non-coordinate searches
    useEffect(() => {
        const handleSearch = async () => {
            if (inputMode !== "coordinates" && debouncedSearchQuery) {
                setIsGeocoding(true);
                try {
                    const coords = await geocodeAddress(debouncedSearchQuery);
                    if (coords) {
                        setLatitude(coords.lat.toString());
                        setLongitude(coords.lng.toString());
                        if (setAddress) {
                            setAddress(debouncedSearchQuery);
                        }
                    } else {
                        toast({
                            title: "Location not found",
                            description: "Please try a different search term",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                } catch (error) {
                    toast({
                        title: "Search failed",
                        description: error instanceof Error ? error.message : "An error occurred",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                } finally {
                    setIsGeocoding(false);
                }
            }
        };

        handleSearch();
    }, [debouncedSearchQuery, inputMode, setLatitude, setLongitude, setAddress, toast]);

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast({
                title: "Geolocation not supported",
                description: "Your browser doesn't support geolocation",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude.toString());
                setLongitude(position.coords.longitude.toString());
                setInputMode("coordinates");
                setIsGettingLocation(false);
                toast({
                    title: "Location updated",
                    description: "Your current location has been set",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            },
            (error) => {
                setIsGettingLocation(false);
                toast({
                    title: "Location error",
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    const getPlaceholderText = () => {
        switch (inputMode) {
            case "coordinates":
                return "Use the coordinate inputs below";
            case "address":
                return "e.g., 123 Main St, City, Country";
            case "place":
                return "e.g., Eiffel Tower, Statue of Liberty";
            case "postal":
                return "e.g., 90210, SW1A 1AA";
            case "landmark":
                return "e.g., Grand Canyon, Mount Everest";
            default:
                return "";
        }
    };

    const getInputLabel = () => {
        switch (inputMode) {
            case "coordinates":
                return "Enter Coordinates";
            case "address":
                return "Enter Address";
            case "place":
                return "Search by Place Name";
            case "postal":
                return "Search by Postal Code";
            case "landmark":
                return "Search by Landmark";
            default:
                return "";
        }
    };

    return (
        <>
            <RadioGroup 
                value={inputMode} 
                onChange={(value) => {
                    setInputMode(value as InputMode);
                    setSearchQuery("");
                }}
                mb={4}
                display="flex"
                justifyContent="center"
            >
                <Stack direction="row" spacing={4} wrap="wrap" justify="center" align="center">
                    <Radio value="coordinates">Enter Coordinates</Radio>
                    <Radio value="address">Enter Address</Radio>
                    <Radio value="place">Search by Place</Radio>
                    <Radio value="postal">Search by Postal Code</Radio>
                    <Radio value="landmark">Search by Landmark</Radio>
                    <Divider orientation="vertical" height="24px" />
                    <Button
                        onClick={handleGetCurrentLocation}
                        isLoading={isGettingLocation}
                        loadingText="Getting location..."
                        colorScheme="blue"
                        size="sm"
                        variant="outline"
                    >
                        Use My Location
                    </Button>
                </Stack>
            </RadioGroup>

            {inputMode === "coordinates" ? (
                <>
                    {isGettingLocation && (
                        <Text fontSize="sm" color="gray.500" textAlign="center" mb={4}>
                            Getting your location...
                        </Text>
                    )}
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                            <LocationInput 
                                label="Enter Latitude"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                onBlur={() => validateCoordinates(true)}
                                placeholder="Range: -90 to 90° (defaults to Los Angeles: 34.0522)"
                            />
                        </GridItem>
                        <GridItem>
                            <LocationInput 
                                label="Enter Longitude"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                onBlur={() => validateCoordinates(true)}
                                placeholder="Range: -180 to 180° (defaults to Los Angeles: -118.2437)"
                            />
                        </GridItem>
                    </Grid>
                </>
            ) : (
                <>
                    <LocationInput 
                        label={getInputLabel()}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={getPlaceholderText()}
                    />
                    {isGeocoding && (
                        <Text fontSize="sm" color="gray.500" mt={2}>
                            Searching for location...
                        </Text>
                    )}
                </>
            )}
        </>
    )
}

export default LocationInputContainer