import React from 'react';
import '../../../scss/SearchResult.scss';
function SearchResult({ searchParams, markerInfo, click, reservationInfo }) {
  // 영어 키를 한국어로 매핑

  const keyTranslations = {
    searchKey: '검색어',
    chgerType: '커넥터',
    powerType: '충전속도',
    limitYn: '외부인개방',
  };

  console.log(markerInfo);

  return (
    <>
      {searchParams && (
        <div className='search-result'>
          <h2>검색 결과</h2>
          <ul>
            {Object.entries(searchParams).map(
              ([key, value]) =>
                value !== '' && (
                  <li key={key}>
                    {keyTranslations[key] || key}: {value}
                  </li>
                ),
            )}
          </ul>
        </div>
      )}
      {/* 실제 검색 결과를 여기에 표시 */}
      {markerInfo && (
        <div className='search-result'>
          {markerInfo.map((info, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#fff',
                marginBottom: '10px',
                padding: '5px',
                border: '1px solid black',
              }}
              onClick={() => click(info.statId)}
            >
              <div className='cSpotStatNm'>충전소명: {info.statNm}</div>
              <div className='limitYn'>이용가능: {info.limitYn}</div>
              <div className='facilityBic'>시설: {info.facilityBig}</div>
              <div className='facilitySmall'>
                시설 형태: {info.facilitySmall}
              </div>
              <div className='cSpotAddr'>주소: {info.addr}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default SearchResult;
