import React, { useContext, useEffect, useRef, useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { API_BASE_URL, CONFIRM } from '../../../config/host-config';
import { nanoid } from 'nanoid';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import { useNavigate } from 'react-router-dom';
import handleRequest from '../../../utils/handleRequest';
import axiosInstance from '../../../config/axios-config';
import AuthContext from '../../../utils/AuthContext';

const Checkout = () => {
  const navigate = useNavigate();
  const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;
  const customerKey = nanoid();

  const [paymentWidget, setPaymentWidget] = useState(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(50000);
  const { onLogout } = useContext(AuthContext);
  // const [reserv, setReserv] = useState({
  //   amount: 1000, // 결제 예시 금액
  // });

  //const paymentWidget = loadPaymentWidget(clientKey, customerKey); // 회원 결제

  useEffect(() => {
    const fetchPaymentWidget = async () => {
      try {
        const loadedWidget = await loadPaymentWidget(clientKey, customerKey);
        setPaymentWidget(loadedWidget);
      } catch (error) {
        console.error('Error fetching payment widget:', error);
      }
    };

    fetchPaymentWidget();
  }, []);

  useEffect(() => {
    if (paymentWidget == null) {
      return;
    }

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      '#payment-widget',
      { value: price },
      { variantKey: 'DEFAULT' },
    );

    paymentWidget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' });

    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  }, [paymentWidget, price]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(price);
  }, [price]);

  const eventOpne = () => {
    handlePaymentRequest();
    createReservation();
  };

  const handlePaymentRequest = async () => {
    // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
    // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
    try {
      await paymentWidget?.requestPayment({
        orderId: nanoid(),
        orderName: '전기차 충전 예약',
        customerName: '김춘식',
        customerEmail: 'cnstlr1234@gmail.com',
        customerMobilePhone: '01012341234',
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      });
      // navigate('/findCharge');
    } catch (error) {
      console.error('Error requesting payment:', error);
    }
  };

  // 예약 등록 요청
  const createReservation = async () => {
    handleRequest(
      () =>
        axiosInstance.post(`${API_BASE_URL}/reservation`, {
          userId: localStorage.getItem('USER_ID'),
          statId: localStorage.getItem('STAT_ID'),
          startTime: localStorage.getItem('START_TIME'),
          finishTime: localStorage.getItem('FINISH_TIME'),
        }),
      navigate,
    );
  };

  // const handlePayment = (paymentType) => {
  //   const random = new Date().getTime() + Math.random();
  //   const randomId = btoa(random.toString()); // 무작위 ID 생성

  //   if (paymentType === '카드') {
  //     loadTossPayments(clientKey).then((tossPayments) => {
  //       console.log(clientKey);
  //       tossPayments.requestPayment(paymentType, {
  //         amount: reserv.amount,
  //         orderId: randomId,
  //         orderName: '결제 주문명', // 실제 주문명으로 교체
  //         customerName: '테스트', // 실제 고객명으로 교체
  //         successUrl: API_BASE_URL + CONFIRM,
  //         failUrl: 'http://localhost:3000',
  //       });
  //     });
  //   }
  // };

  return (
    <>
      <div style={{ width: 600 }}>
        {/* 결제 UI, 이용약관 UI 영역 */}
        <div id='payment-widget' />
        <div id='agreement' />
        {/* 결제하기 버튼 */}
        <button style={{ width: '90px' }} onClick={eventOpne}>
          예약 하기
        </button>
      </div>
    </>
  );
};

export default Checkout;
