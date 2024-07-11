import React, { useContext, useEffect, useState } from 'react';
import './Chargespace.scss';
import AuthContext from '../../../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import handleRequest from '../../../../utils/handleRequest';
import axiosInstance from '../../../../config/axios-config';
import { API_BASE_URL } from '../../../../config/host-config';
import MyReviewItem from './MyReviewItem';

const MyReview = () => {
  const [reviewList, setReviewList] = useState([]);
  const { onLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const reviewRendering = async () => {
    handleRequest(
      () =>
        axiosInstance.get(
          `${API_BASE_URL}/review/retrieve?userId=${localStorage.getItem('USER_ID')}`,
        ),
      (data) => {
        console.log(data.reviewList);
        if (data) {
          setReviewList(data.reviewList);
        } else {
          setReviewList([]);
        }
      },
      onLogout,
      navigate,
    );
  };

  useEffect(() => {
    reviewRendering();
  }, []);

  return (
    <div className='chargeSpaceContainer'>
      {reviewList.length > 0 ? (
        reviewList.map((review) => (
          <MyReviewItem key={review.reviewNo} info={review} />
        ))
      ) : (
        <div>작성한 후기가 없습니다.</div>
      )}
      {/* <div className='chargeSpaceItem'>
        <div className='chargeSpaceTitle'>충전소 1</div>
        <div className='chargeSpaceInfo'>주소 1</div>
      </div>
      <div className='chargeSpaceItem'>
        <div className='chargeSpaceTitle'>충전소 2</div>
        <div className='chargeSpaceInfo'>주소 2</div>
      </div>
      <div className='chargeSpaceItem'>
        <div className='chargeSpaceTitle'>충전소 3</div>
        <div className='chargeSpaceInfo'>주소 3</div>
      </div>
      <div className='chargeSpaceItem'>
        <div className='chargeSpaceTitle'>충전소 4</div>
        <div className='chargeSpaceInfo'>주소 4</div>
      </div>
      <div className='chargeSpaceItem'>
        <div className='chargeSpaceTitle'>충전소 5</div>
        <div className='chargeSpaceInfo'>주소 5</div>
      </div>
      <div className='chargeSpaceItem'>
        <div className='chargeSpaceTitle'>충전소 6</div>
        <div className='chargeSpaceInfo'>주소 6</div>
      </div> */}
    </div>
  );
};

export default MyReview;
