import { useState, useEffect } from "react";
import LocationInput from "./LocationInput";
import { Text, useToast, Button, HStack, Grid, GridItem, RadioGroup, Radio, Stack, Divider, Box } from "@chakra-ui/react";
import { isValidLatitude, isValidLongitude, geocodeAddress } from "../utils/locationUtils";
import useDebounce from "../hooks/useDebounce";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
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
                    title: t('errors.coordinates.invalidLatitude.title'),
                    description: t('errors.coordinates.invalidLatitude.description'),
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
                    title: t('errors.coordinates.invalidLongitude.title'),
                    description: t('errors.coordinates.invalidLongitude.description'),
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
                        title: t('errors.coordinates.invalid.title'),
                        description: !isLatValid 
                            ? t('errors.coordinates.invalidLatitude.description')
                            : t('errors.coordinates.invalidLongitude.description'),
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
                        title: t('errors.geocoding.failed.title'),
                        description: t('errors.geocoding.failed.description'),
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            }
        };

        handleAddressChange();
    }, [debouncedAddress, inputMode, setLatitude, setLongitude, toast, t]);

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
                            title: t('errors.search.notFound.title'),
                            description: t('errors.search.notFound.description'),
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                } catch (error) {
                    toast({
                        title: t('errors.search.failed.title'),
                        description: t('errors.search.failed.description', { message: error instanceof Error ? error.message : "An error occurred" }),
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
    }, [debouncedSearchQuery, inputMode, setLatitude, setLongitude, setAddress, toast, t]);

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast({
                title: t('errors.geolocation.notSupported.title'),
                description: t('errors.geolocation.notSupported.description'),
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
                    title: t('messages.location.updated.title'),
                    description: t('messages.location.updated.description'),
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            },
            (error) => {
                setIsGettingLocation(false);
                toast({
                    title: t('errors.geolocation.error.title'),
                    description: t('errors.geolocation.error.description', { message: error.message }),
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
                return t('input.coordinates.placeholder');
            case "address":
                return t('input.address.placeholder');
            case "place":
                return t('input.place.placeholder');
            case "postal":
                return t('input.postal.placeholder');
            case "landmark":
                return t('input.landmark.placeholder');
            default:
                return "";
        }
    };

    const getInputLabel = () => {
        switch (inputMode) {
            case "coordinates":
                return t('input.coordinates.label');
            case "address":
                return t('input.address.label');
            case "place":
                return t('input.place.label');
            case "postal":
                return t('input.postal.label');
            case "landmark":
                return t('input.landmark.label');
            default:
                return "";
        }
    };

    return (
        <Stack spacing={4}>
            <Box 
                bg="white" 
                p={[3, 4]} 
                borderRadius="12px" 
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
            >
                <RadioGroup value={inputMode} onChange={(value) => setInputMode(value as InputMode)}>
                    <Stack direction={["column", "row"]} spacing={[2, 4]} wrap="wrap" justify="center" align={["stretch", "center"]}>
                        <Stack direction={["column", "row"]} spacing={[1, 4]} wrap="wrap" justify="center" align="center">
                            <Radio value="coordinates" size={["sm", "md"]}>{t('input.coordinates.label')}</Radio>
                            <Radio value="address" size={["sm", "md"]}>{t('input.address.label')}</Radio>
                            <Radio value="place" size={["sm", "md"]}>{t('input.place.label')}</Radio>
                            <Radio value="postal" size={["sm", "md"]}>{t('input.postal.label')}</Radio>
                            <Radio value="landmark" size={["sm", "md"]}>{t('input.landmark.label')}</Radio>
                        </Stack>
                        <Button
                            onClick={handleGetCurrentLocation}
                            isLoading={isGettingLocation}
                            loadingText={t('input.useMyLocation')}
                            bg="#ffb88c"
                            color="white"
                            size={["sm", "sm"]}
                            width={["full", "auto"]}
                            mt={[2, 0]}
                            _hover={{ 
                                bg: "#ff994c", 
                                transform: "translateY(-1px)", 
                                boxShadow: "sm" 
                            }}
                            transition="all 0.2s"
                            borderRadius="12px"
                        >
                            📍 {t('input.useMyLocation')}
                        </Button>
                    </Stack>
                </RadioGroup>
            </Box>

            {inputMode !== "coordinates" && (
                <Box 
                    bg="white" 
                    p={4} 
                    borderRadius="lg" 
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    <LocationInput
                        label={getInputLabel()}
                        placeholder={getPlaceholderText()}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Box>
            )}

            {inputMode === "coordinates" && (
                <Box 
                    bg="white" 
                    p={4} 
                    borderRadius="lg" 
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                            <LocationInput
                                label={t('input.latitude.label')}
                                placeholder={t('input.latitude.placeholder')}
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                            />
                        </GridItem>
                        <GridItem>
                            <LocationInput
                                label={t('input.longitude.label')}
                                placeholder={t('input.longitude.placeholder')}
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                            />
                        </GridItem>
                    </Grid>
                </Box>
            )}
        </Stack>
    );
};

export default LocationInputContainer;