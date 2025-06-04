import React, { useEffect, useRef, useState } from 'react';

/* global google */
const containerStyle = {
  width: '100%',
  height: '400px'
};

const MapDisplay = ({ latitude, longitude }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const mapRef = useRef(null);
  const center = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude)
  };

  useEffect(() => {
    const scriptId = 'google-maps-script';
    
    if (document.getElementById(scriptId)) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAyn6Nme1pRUxvogWF-HPftNl-Jcr8BkM4`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      setIsScriptLoaded(true);
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isScriptLoaded) {
      initMap();
    }
  }, [isScriptLoaded, center]);

  const initMap = () => {
    const mapElement = document.getElementById('map');
    if (mapElement && !mapRef.current) {
      mapRef.current = new google.maps.Map(mapElement, {
        center,
        zoom: 15
      });
      new google.maps.Marker({ 
        position: center,
        map: mapRef.current,
      });
    }
  };

  return <div className ="flex w-full h-full"id="map" style={containerStyle}></div>;
};

export default MapDisplay;
