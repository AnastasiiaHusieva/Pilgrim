import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  GoogleMap,
  useJsApiLoader,
  OverlayView,
  Marker,
} from "@react-google-maps/api";
import { useTheme } from "../../components/ThemeContext";
import "./Maps.css";

const containerStyle = {
  width: "100vw",
  height: "85vh",
};

const center = {
  lat: 51.1657,
  lng: 10.4515,
};

const cities = [
  { id: 1, name: "Paris", position: { lat: 48.8566, lng: 2.3522 } },
  { id: 2, name: "Berlin", position: { lat: 52.52, lng: 13.405 } },
  { id: 3, name: "Madrid", position: { lat: 40.4168, lng: -3.7038 } },
  { id: 4, name: "Rome", position: { lat: 41.9028, lng: 12.4964 } },
];

const lightModeStyles = {
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }], // Hide points of interest labels
    },
    {
      featureType: "poi.business",
      elementType: "labels.text",
      stylers: [{ visibility: "off" }], // Hide business labels
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        { visibility: "on" }, // Hide landscape elements
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#fafafa", // Borders color (darker grey)
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "labels.text",
      stylers: [
        {
          visibility: "off", // Hide administrative labels (including countries)
        },
      ],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels",
      stylers: [
        {
          visibility: "off", // Locality labels color (hide city labels)
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "labels",
      stylers: [
        {
          visibility: "off", // Country labels color (hide country labels)
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          visibility: "off", // Roads color (dark grey)
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#5C5C5C", // Road labels color (darker grey)
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#D0E8E4", // Very light grey-greenish color for water
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          visibility: "off", // Hide water labels
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
      featureType: "poi.business",
      elementType: "labels.text",
      stylers: [{ visibility: "off" }], // Hide business labels
    },
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }], // Hide points of interest labels
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        { visibility: "on" }, // Hide landscape elements
      ],
    },
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#2E2E2E", // Background color (dark grey)
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#2E2E2E", // Text stroke color (dark grey)
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#7F7F7F", // Text color (light grey)
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#404040", // Borders color (darker grey)
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [
        {
          visibility: "off", // Administrative labels color
        },
      ],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels",
      stylers: [
        {
          visibility: "off", // Locality labels color (hide city labels)
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "labels",
      stylers: [
        {
          visibility: "off", // Country labels color (hide country labels)
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: "#333333", // Roads color (dark grey)
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#5C5C5C", // Road labels color (darker grey)
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "4f4c4c", // Water color (darker grey)
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          visibility: "off", // Hide water labels
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
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBi9RTScwQgXzNJC4F7dST4aAL4ZMVc588",
  });

  const [map, setMap] = React.useState(null);
  const { isDarkMode } = useTheme();
  const [selectedCity, setSelectedCity] = useState(null);

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

  const handleCityClick = (city) => {
    if (selectedCity && selectedCity._id === city._id) {
      setSelectedCity(null);
    } else {
      setSelectedCity(city);
      console.log("Selected City:", selectedCity);
    }
  };

  const handleMapClick = () => {
    setSelectedCity(null);
  };

  const calculateBubbleMenuPosition = (map, position) => {
    if (!map) {
      return { left: 0, top: 0 };
    }

    const projection = map.getProjection();

    if (
      !projection ||
      typeof projection.fromLatLngToContainerPixel !== "function"
    ) {
      return { left: 0, top: 0 };
    }

    const pixel = projection.fromLatLngToContainerPixel(
      new window.google.maps.LatLng(position.lat, position.lng)
    );

    // Adjust the positioning based on your preference
    const offsetX = -50; // Adjust as needed
    const offsetY = -50; // Adjust as needed

    return {
      left: pixel.x + offsetX,
      top: pixel.y + offsetY,
    };
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={3.7}
      options={mapOptions}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleMapClick}
    >
      {cities.map((city) => (
        <React.Fragment key={city.id}>
          <Marker
            onClick={() => {
              handleCityClick(city);
              console.log("dfghjklkjhbgvfcdfghj");
            }}
            position={city.position}
            icon={{
              path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              fillColor: "#FF385C",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 1,
              scale: 3.5,
            }}
          />
          <OverlayView
            position={city.position}
            mapPaneName={OverlayView.OVERLAY_LAYER}
            style={{ zIndex: 1000 }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleCityClick(city);
              }}
              className={`absolute transform -translate-x-1/2 px-5 py-0 rounded font-bold text-lg ${
                isDarkMode ? "text-gray-200" : "text-gray-600"
              }`}
              style={{ left: "50%", transform: "translateX(-50%)" }}
            >
              {city.name}
              {selectedCity && selectedCity.id === city.id && (
                <div
                  className="bubble-menu flex flex-col items-center"
                  style={calculateBubbleMenuPosition(map, city.position)}
                >
                  <Link
                    className="bubble-menu-item move1"
                    data-label="Hotels"
                    style={{ transform: "translateY(20px) translateX(0px)" }}
                  >
                    <img src="/hotel.png" alt="hotel" className="w-6 h-6" />
                  </Link>
                  <Link
                    className="bubble-menu-item move2"
                    data-label="Cafe"
                    style={{ transform: " translateY(-70px) translateX(60px)" }}
                  >
                    <img src="/cafe.png" alt="diet" className="w-6 h-6" />
                  </Link>
                  <Link
                    className="bubble-menu-item move3"
                    data-label="Events"
                    style={{ transform: "translateY(-185px) translateX(55px)" }}
                  >
                    <img src="/planner.png" alt="people" className="w-6 h-6" />
                  </Link>
                  <Link
                    className="bubble-menu-item move4"
                    data-label="Feed"
                    style={{ transform: "translateY(-270px) translateX(0px)" }}
                  >
                    <img
                      src="/publication.png"
                      alt="publication"
                      className="w-6 h-6"
                    />
                  </Link>
                </div>
              )}
            </div>
          </OverlayView>
        </React.Fragment>
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(Maps);
