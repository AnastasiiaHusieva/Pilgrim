import React from 'react';
import { GoogleMap, useJsApiLoader, OverlayView, Marker } from '@react-google-maps/api';
import { useTheme } from '../../components/ThemeContext';


const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: 51.1657,
  lng: 10.4515,
};

const cities = [
  { id: 1, name: 'Paris', position: { lat: 48.8566, lng: 2.3522 } },
  { id: 2, name: 'Berlin', position: { lat: 52.5200, lng: 13.4050 } },
  { id: 3, name: 'Madrid', position: { lat: 40.4168, lng: -3.7038 } },
  { id: 4, name: 'Rome', position: { lat: 41.9028, lng: 12.4964 } },
];

// change



const lightModeStyles = {
  styles: [
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [
        { visibility: 'off' }, // Hide landscape elements
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '93c19f', // Borders color (darker grey)
        },
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        {
          visibility: 'off', // Administrative labels color
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          visibility: 'off', // Roads color (dark grey)
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#5C5C5C', // Road labels color (darker grey)
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#D0E8E4', // Very light grey-greenish color for water
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          visibility: 'off', // Hide water labels
        },
      ],
    },
  ],
  mapTypeControl: false,
  zoomControl: false,
  fullscreenControl: false,
  streetViewControl: false,
};

const darkModeStyles = {
  styles: [
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [
        { visibility: 'off' }, // Hide landscape elements
      ],
    },
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#2E2E2E', // Background color (dark grey)
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#2E2E2E', // Text stroke color (dark grey)
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#7F7F7F', // Text color (light grey)
        },
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#404040', // Borders color (darker grey)
        },
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        {
          visibility: 'off', // Administrative labels color
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#333333', // Roads color (dark grey)
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#5C5C5C', // Road labels color (darker grey)
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '4f4c4c', // Water color (darker grey)
        },
      ],
    },
  ],
  mapTypeControl: false,
  zoomControl: false,
  fullscreenControl: false,
  streetViewControl: false,
};



function Maps() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyBi9RTScwQgXzNJC4F7dST4aAL4ZMVc588'
  });

  const [map, setMap] = React.useState(null);
  const { isDarkMode } = useTheme();



  const mapOptions = {
    styles: isDarkMode ? darkModeStyles.styles : lightModeStyles.styles,
    mapTypeControl: false,
    zoomControl: false,
    fullscreenControl: false,
    streetViewControl: false,
  };


  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={3.7}
      options={mapOptions}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {cities.map((city) => (
        <React.Fragment key={city.id}>
          <Marker
            position={city.position}
            icon={{
              path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              fillColor: '#FF385C',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 1,
              scale: 3.5,
            }}
          />
          <OverlayView
            position={city.position}
            mapPaneName={OverlayView.OVERLAY_LAYER}
          >

            <div className={`absolute transform -translate-x-1/4 -translate-y-1/3 px-5 py-7 rounded font-bold text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
              {city.name}
            </div>
          </OverlayView>
        </React.Fragment>
      ))}
    </GoogleMap>
  ) : <></>;
}

export default React.memo(Maps);
