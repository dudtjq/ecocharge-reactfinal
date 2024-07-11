import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faStar as filledStar,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import '../../../scss/ChargeSpotDetail.scss';
import Checkout from '../toss/Checkout';
import { API_BASE_URL, CHARGESPOT } from '../../../config/host-config';
import axiosInstance from '../../../config/axios-config';
import handleRequest from '../../../utils/handleRequest';
import AuthContext from '../../../utils/AuthContext';

function ChargeSpotDetail() {
  const [open, setOpen] = useState(false);
  const [charger, setCharger] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [warning, setWarning] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [review, setReview] = useState('');
  const navigate = useNavigate();
  const [aroundInfo, setAroundInfo] = useState(null);
  const { onLogout } = useContext(AuthContext);

  // 더미 데이터
  const address = '서울특별시 마포구 백범로 123-56';
  const REQUEST_URL = API_BASE_URL + CHARGESPOT;

  const [spotInfo, setSpotInfo] = useState(null);
  const [{ lat, lng }, setLatLng] = useState({
    lat: null,
    lng: null,
  });
  const [spotReview, setSpotReview] = useState([]);

  const statId = location.search.split('=')[1];

  useEffect(() => {
    const fetchSpotDetail = async () => {
      const res = await axiosInstance.get(
        REQUEST_URL + `/detail?statId=${statId}`,
      );

      setSpotInfo(res.data);
      console.log(res.data);
      if (res) {
        const lat = res.data.latLng.split(',')[0];
        const lng = res.data.latLng.split(',')[1];
        setLatLng({ lat, lng });
      }
    };
    fetchSpotDetail();
  }, [location.search]);

  useEffect(() => {
    // 충전소 후기 요청 함수
    const spotReviewList = async () => {
      handleRequest(
        () =>
          axiosInstance.get(`${API_BASE_URL}/review/retrieve?statId=${statId}`),
        (data) => {
          setSpotReview(data.reviewList);
        },
        onLogout,
        navigate,
      );
    };
    spotReviewList();
    console.log(spotReview);
  }, [location.searchreview, review]);

  useEffect(() => {
    const fetchAroundSpotList = async () => {
      const res = await axiosInstance.get(
        REQUEST_URL + `/aroundlist?lat=${lat}&lng=${lng}`,
      );
      setAroundInfo(res.data);
      console.log(res.data);
    };
    if (lat !== null && lng !== null) {
      fetchAroundSpotList();
    }
  }, [lat, lng]);

  const handleReservation = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 이용 후기 등록 핸들러
  const handleSubmitReview = async () => {
    const reviewData = {
      statId,
      userId: localStorage.getItem('USER_ID'),
      content: review,
    };
    handleRequest(
      () => axiosInstance.post(`${API_BASE_URL}/review/create`, reviewData),
      (data) => {
        console.log('이용후기가 등록되었습니다 :', review);
        alert('후기가 등록되었습니다.');
        setReview('');
      },
      onLogout,
      navigate,
    );
  };

  const handleBackToList = () => {
    navigate('/findCharge');
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked((prev) => !prev);
  };

  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      const formattedHour = String(hour).padStart(2, '0');
      times.push(`${formattedHour}:00`);
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

  const calculateTimeDifference = (start, end) => {
    const [startHour] = start.split(':').map(Number);
    const [endHour] = end.split(':').map(Number);
    let difference = endHour - startHour;
    if (difference < 0) difference += 24;
    return difference;
  };

  useEffect(() => {
    if (startTime && endTime) {
      const diff = calculateTimeDifference(startTime, endTime);
      if (diff > 12) {
        setWarning('예약시간은 12시간을 넘길 수 없습니다.');
      } else {
        setWarning('');
      }
    }
  }, [startTime, endTime]);

  return (
    <div className='charge-spot-detail-container'>
      <div className='GoFindCharge' onClick={handleBackToList}>
        <FontAwesomeIcon icon={faChevronLeft} /> &nbsp;BACK
      </div>
      <div className='page-title'>
        <h2>충전소 상세정보</h2>
        <div className='button-group'>
          <Button
            onClick={handleReservation}
            color='primary'
            variant='contained'
            className='reservation-button'
            style={{ background: 'crimson' }}
          >
            예약하기
          </Button>
          <div
            className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleBookmarkToggle}
          ></div>
        </div>
      </div>

      {spotInfo && (
        <div className='charge-spot-detail-content'>
          <div className='section'>
            <h2>충전소명</h2>
            <p>{spotInfo.statNm}</p>
          </div>

          <div className='section'>
            <h2>충전정보</h2>
            {spotInfo.chargerList.map((charger, index) => (
              <p key={index}>{charger.chgerType}</p>
            ))}
          </div>
          {aroundInfo && (
            <div className='section'>
              <h2>근처 충전소 목록</h2>
              {aroundInfo.map((info, index) => (
                <div key={index} className='aroundList'>
                  <p>{info.addr}</p>
                  <p>{info.statNm}</p>
                </div>
              ))}
            </div>
          )}

          <div className='section'>
            <h2>이용후기</h2>
            {spotReview.length > 0 ? (
              spotReview.map((review) => (
                <div key={review.reviewNo}>
                  <span>{review.content}</span>
                  <p>{review.reviewDate}</p>
                </div>
              ))
            ) : (
              <div>작성된 후기가 없습니다.</div>
            )}
          </div>
        </div>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>예약</DialogTitle>
        <DialogContent>
          <Typography>카카오페이로 예약을 진행하시겠습니까?</Typography>
          <Typography variant='body1' style={{ margin: '30px 0' }}>
            주소 : {address}
          </Typography>
          <TextField
            select
            label='사용 가능한 충전기'
            value={charger}
            onChange={(e) => setCharger(e.target.value)}
            fullWidth
            margin='normal'
          >
            <MenuItem value='charger1'>충전기 1</MenuItem>
            <MenuItem value='charger2'>충전기 2</MenuItem>
            <MenuItem value='charger3'>충전기 3</MenuItem>
            <MenuItem value='charger4'>충전기 4</MenuItem>
          </TextField>

          <TextField
            select
            label='시작 시간대'
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            fullWidth
            margin='normal'
          >
            {timeSlots.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>

          {warning && (
            <Typography color='error' style={{ marginTop: '10px' }}>
              {warning}
            </Typography>
          )}

          <TextField
            select
            label='끝나는 시간대'
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            fullWidth
            margin='normal'
          >
            {timeSlots.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Checkout />
          <Button onClick={handleClose} color='primary'>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
      <div className='info-box'>
        <div className='map-review-container'>
          <div className='review-input-container'>
            <h3>후기 작성</h3>
            <TextField
              className='text-field'
              label='이용 후기'
              multiline
              // rows={6}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              // variant='outlined'
              fullWidth
              style={{ marginTop: '20px' }}
            />
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: '20px', background: 'rgb(69, 69, 209)' }}
              onClick={handleSubmitReview}
            >
              등록
            </Button>
          </div>
          <div className='map-placeholder'>{/* 지도 컴포넌트..ㄱㄱ */}</div>
        </div>
      </div>
    </div>
  );
}

export default ChargeSpotDetail;
