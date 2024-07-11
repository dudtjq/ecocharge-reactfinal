import React, { useContext, useEffect, useState } from 'react';
import '../inquiry/InquiryList.scss';
import AuthContext from '../../../../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import handleRequest from '../../../../../utils/handleRequest';
import axiosInstance from '../../../../../config/axios-config';
import { API_BASE_URL } from '../../../../../config/host-config';
import InquiryItem from './InquiryItem';

const InquiryList = () => {
  const [inquiryList, setInquiryList] = useState([]);
  const { onLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const inquiryListRendering = async () => {
    handleRequest(
      () =>
        axiosInstance.get(
          `${API_BASE_URL}/qna/user?userId=${localStorage.getItem('USER_ID')}`,
        ),
      (data) => {
        console.log(data.qnas);
        if (data) {
          setInquiryList(data.qnas);
        } else {
          setInquiryList([]);
        }
      },
      onLogout,
      navigate,
    );
  };

  useEffect(() => {
    inquiryListRendering();
  }, []);

  return (
    <div className='inquiryListContainer'>
      {inquiryList.length > 0 ? (
        inquiryList.map((inquiry) => (
          <InquiryItem key={inquiry.qnaNo} info={inquiry} />
        ))
      ) : (
        <div>문의내용이 없습니다.</div>
      )}
      {/* <div className='inquiryItem'>
        <div className='inquiryTitle'>문의사항 1</div>
        <div className='inquiryContent'>내용: 문의 내용 1</div>
      </div>
      <div className='inquiryItem'>
        <div className='inquiryTitle'>문의사항 2</div>
        <div className='inquiryContent'>내용: 문의 내용 2</div>
      </div>
      <div className='inquiryItem'>
        <div className='inquiryTitle'>문의사항 3</div>
        <div className='inquiryContent'>내용: 문의 내용 3</div>
      </div>
      <div className='inquiryItem'>
        <div className='inquiryTitle'>문의사항 4</div>
        <div className='inquiryContent'>내용: 문의 내용 4</div>
      </div>
      <div className='inquiryItem'>
        <div className='inquiryTitle'>문의사항 5</div>
        <div className='inquiryContent'>내용: 문의 내용 5</div>
      </div>
      <div className='inquiryItem'>
        <div className='inquiryTitle'>문의사항 6</div>
        <div className='inquiryContent'>내용: 문의 내용 6</div>
      </div> */}
    </div>
  );
};

export default InquiryList;
