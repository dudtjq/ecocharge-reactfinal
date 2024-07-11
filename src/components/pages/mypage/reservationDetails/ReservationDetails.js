import { Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ReservationItem from './reservationItem/ReservationItem';
import handleRequest from '../../../../utils/handleRequest';
import axiosInstance from '../../../../config/axios-config';
import { API_BASE_URL } from '../../../../config/host-config';
import AuthContext from '../../../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const ReservationDetails = () => {
  const [reservationList, setReservationList] = useState([]);
  const { onLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const reservationListRendering = async () => {
    handleRequest(
      () =>
        axiosInstance.post(`${API_BASE_URL}/reservation/list`, {
          userId: localStorage.getItem('USER_ID'),
        }),
      (data) => {
        if (data) {
          setReservationList(data);
        } else {
          setReservationList([]);
        }
      },
      onLogout,
      navigate,
    );
  };

  useEffect(() => {
    reservationListRendering();
  }, []);

  return (
    <Grid container className='reservationListContainer'>
      {reservationList.length > 0 ? (
        reservationList.map((reservation) => (
          <ReservationItem key={reservation.reservationNo} info={reservation} />
        ))
      ) : (
        <div>예약이 없습니다.</div>
      )}
    </Grid>
  );
};

export default ReservationDetails;
