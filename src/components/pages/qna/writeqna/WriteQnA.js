import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WriteQnA';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Grid } from '@mui/material';
import { API_BASE_URL, QNA } from '../../../../config/host-config';
import axiosInstance from '../../../../config/axios-config';

const WriteQnA = () => {
  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [category, setCategory] = useState(''); // New state for category
  const navigate = useNavigate();

  const [content, setContent] = useState('');
  const REQUEST_URL = API_BASE_URL + QNA;
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData({
      userId: localStorage.getItem('USER_ID'),
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // console.log(value);
  };

  const fetchQna = async () => {
    try {
      const userRole = localStorage.getItem('ROLE');
      const data = formData;
      const body = JSON.stringify(data);
      const res = await axiosInstance.post(REQUEST_URL, body);
      // console.log(res.data);
      if (res.data) {
        alert('게시글이 작성되었습니다');
        navigate('/qnalist');
      }
    } catch (error) {
      if (error.response) {
        // 서버에서 응답을 받았지만 오류가 발생한 경우
        // console.error('Error response:', error.response.data);
        // 여기서 오류 메시지를 콘솔에 출력하거나, 사용자에게 알림 등의 처리를 추가할 수 있습니다.
        alert('양식을 확인해주세요!');
        navigate('/questionform');
      } else {
        // 오류를 발생시킨 요청을 설정하는 도중 문제가 발생한 경우
        // console.error('Error setting up request:', error.message);
        alert(
          '요청을 처리하는 도중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        );
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const questionFormData = {
      title,
      content,
      category, // Include category in form data
    };
    // console.log(questionFormData);
    navigate('/myquestionlist');
  };

  // const handleBack = () => {
  //   navigate('/qnalist');
  // };

  return (
    <div className='QquestionWriteContainer' style={{ padding: '2rem' }}>
      <div className='gomyquestionlistBtnBox'>
        <div
          className='gomyquestionlistBtn'
          onClick={() => navigate('/qnalist')}
        >
          <FontAwesomeIcon icon={faChevronLeft} /> &nbsp;Back
        </div>
      </div>

      <h2 className='questionWriteTitle'>1:1 문의</h2>
      {/* <Button
        className='questionListBackBtn'
        color='secondary'
        onClick={handleBack}
        style={{ marginBottom: '1rem' }}
      >
        되돌아가기
      </Button> */}
      <div className='QquestionFormBox'>
        <Form onSubmit={handleSubmit}>
          <FormGroup className='questionWriteForm'>
            <Label for='qcategory'>카테고리</Label>
            <Input
              className='qnaSelect'
              type='select'
              name='qcategory'
              id='qcategory'
              value={formData.qcategory}
              onChange={handleChange}
            >
              <option value='' disabled>
                카테고리를 선택하세요
              </option>
              <option>홈페이지</option>
              <option>전기차 충전소</option>
              <option>기타</option>
            </Input>
          </FormGroup>
          <FormGroup className='questionWriteForm'>
            <Label for='qtitle'>제목</Label>
            <Input
              className='qTitleBox'
              type='text'
              name='qtitle'
              id='qtitle'
              placeholder='제목을 입력하세요'
              value={formData.qtitle}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup className='questionWriteForm'>
            <Label for='qcontent'>내용</Label>
            <Input
              type='textarea'
              name='qcontent'
              id='qcontent'
              placeholder='내용을 입력하세요'
              className='qcontentbox'
              value={formData.qcontent}
              onChange={handleChange}
            />
          </FormGroup>
          <Grid className='QquestionWirteCompleteBtnBox'>
            <Button
              type='submit'
              color='primary'
              className='QquestionWirteCompleteBtn'
              onClick={fetchQna}
            >
              작성 완료
            </Button>
          </Grid>
        </Form>
      </div>
    </div>
  );
};

export default WriteQnA;
