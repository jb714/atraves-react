import { GoogleMap, useLoadScript, Marker, useGoogleMap } from "@react-google-maps/api";
import { getApiKey } from "../utils/locationUtils";
import { useEffect, useRef } from "react";

const containerStyle = {
    width: '100%',
    height: '400px'
}

type MapProps = {
    lat: number
    lng: number
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

const Map = ({ lat, lng}: MapProps) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: getApiKey()
    })

    const center = { lat, lng }

    if (!isLoaded) return <div>Loading...</div>

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
        >
            <Marker position={center} />
            <MapUpdater lat={lat} lng={lng} />
        </GoogleMap>
    )
}

export default Map;