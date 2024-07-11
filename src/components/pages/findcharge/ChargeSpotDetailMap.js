import React from 'react';
import { Marker, NaverMap, useNavermaps } from 'react-naver-maps';

const ChargeSpotDetailMap = ({ lat, lng }) => {
  return (
    <NaverMap
      mapDivId={'maps-getting-started-uncontrolled'}
      defaultCenter={new window.naver.maps.LatLng(lat, lng)}
      defaultZoom={15}
      mapDataControl={false}
      // onCenterChanged={handleCenterChanged}
    >
      <Marker position={new window.naver.maps.LatLng(lat, lng)}></Marker>
    </NaverMap>
  );
};

export default ChargeSpotDetailMap;
