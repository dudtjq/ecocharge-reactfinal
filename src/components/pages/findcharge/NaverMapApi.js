import React from 'react';
import { NavermapsProvider } from 'react-naver-maps';
import MapComponent from './MapComponent';
import ChargeSpotDetailMap from './ChargeSpotDetailMap';
const NaverMapApi = ({
  lat,
  lng,
  addr,
  setGeometricData,
  markerLatLng,
  setZoom,
  onMarkerClick,
}) => {
  return (
    <>
      {location.pathname === '/findCharge' && (
        <MapComponent
          lat={lat}
          lng={lng}
          addr={addr}
          setGeometricData={setGeometricData}
          markerLatLng={markerLatLng}
          setZoom={setZoom}
          onMarkerClick={onMarkerClick}
        />
      )}
      {location.pathname === '/ChargeSpotDetail' && (
        <ChargeSpotDetailMap lat={lat} lng={lng} />
      )}
    </>
  );
};

export default NaverMapApi;
