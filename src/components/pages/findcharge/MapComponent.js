import { style } from '@mui/system';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Marker, NaverMap, useNavermaps } from 'react-naver-maps';

function MapComponent({
  lat,
  lng,
  addr,
  setGeometricData,
  markerLatLng,
  setZoom,
  onMarkerClick,
}) {
  const [center, setCenter] = useState({ lat, lng });
  const navermaps = useNavermaps();
  console.log(navermaps);

  useEffect(() => {
    if (addr !== null && addr !== '' && addr !== undefined) {
      navermaps.Service.geocode(
        {
          address: addr,
        },
        function (status, response) {
          if (status !== navermaps.Service.Status.OK) {
            console.log('error');
            return alert('Something wrong!');
          }
          console.log('응답 = ', response);
          const result = response.result;
          console.log('결과 = ', result); // Container of the search result
          const items = result.items; // Array of the search result
          console.log('아이템 = ', items);
          // do Something
          if (items.length <= 0) {
            return alert('검색어를 확인하세요');
          }
          console.log(
            '위도 = ',
            items[0].point.y,
            ' 경도 = ',
            items[0].point.x,
          );
          setCenter({
            lat: items[0].point.y,
            lng: items[0].point.x,
          });
        },
      );
    }
  }, [addr]);

  useEffect(() => {
    setGeometricData({ mapLat: center.lat, mapLng: center.lng });
  }, [center]);

  return (
    <NaverMap
      mapDivId={'maps-getting-started-uncontrolled'}
      center={new navermaps.LatLng(center.lat, center.lng)}
      defaultZoom={15}
      mapTypeControl={true}
      onIdle={(e) => {
        console.log(e.__targets.scale.target.zoom);
        setCenter({
          lat: e.__targets.scale.target.center._lat,
          lng: e.__targets.scale.target.center._lng,
        });
        setZoom(e.__targets.scale.target.zoom);
      }}
    >
      {markerLatLng &&
        markerLatLng.map((marker, index) => (
          <Marker
            key={index}
            position={new navermaps.LatLng(marker.lat, marker.lng)}
            onClick={() => {
              console.log(marker.lat);
              onMarkerClick(marker.lat, marker.lng);
            }}
          />
        ))}
    </NaverMap>
  );
}

export default MapComponent;
