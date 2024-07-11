import React from 'react';
import '../mypage/MyPage.scss';
import MyInfo from './myInfo/MyInfo';
import ReservationDetails from './reservationDetails/ReservationDetails';
import InquiryList from './myInfo/inquiry/InquiryList';
import MyReview from './MyReview/MyReview';

const MyPage = () => {
  return (
    <div className='mainContainer'>
      <div className='myInfoContainer'>
        <MyInfo />
      </div>
      <div className='contentContainer'>
        <div className='subContainer'>
          <h2 className='titles'>충전소 예약내역</h2>
          <ReservationDetails />
        </div>
        <div className='subContainer'>
          <h2 className='titles'>나의 문의사항</h2>
          <InquiryList />
        </div>
        <div className='bookmarkChargeSpaceContainer'>
          <h2 className='bookmarkChargeSpaceTitle'>나의 후기</h2>
          <MyReview />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
