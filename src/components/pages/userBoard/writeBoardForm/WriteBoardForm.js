import React from 'react';
import './WriteBoardForm.scss';
import { Button, Form, FormGroup, FormText, Input, Label } from 'reactstrap';
import { Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const WriteBoardForm = () => {
  const navigate = useNavigate();

  return (
    <Grid className='WboardFormContainer'>
      <Grid className='WboardTop'>
        <div
          className='WgoWriteBoardBtn'
          onClick={() => navigate('/userBoard')}
        >
          <FontAwesomeIcon icon={faChevronLeft} /> &nbsp;Back
        </div>

        <h2 className='wBTitle'>게시글 작성</h2>
      </Grid>
      <Form className='WboardFormBox'>
        <FormGroup>
          <Label for='writeBoardTitle'>제목</Label>
          <Input
            id='writeBoardTitle'
            name='title'
            placeholder='제목을 입력해주세요.'
            type='title'
            className='wbtBox'
          />
        </FormGroup>

        <FormGroup>
          <Label for='writeBoardContent'>내용</Label>
          <Input
            id='writeBoardContent'
            name='text'
            type='textarea'
            className='wbcBox'
          />
        </FormGroup>
        <FormGroup>
          <Label for='writeBoardFile'>첨부파일</Label>
          <Input
            id='writeBoardFile'
            name='file'
            type='file'
            className='wbfBox'
          />
          <Grid className='fileComment'>
            <FormText>
              여러분의 의견을 더욱 풍부하게 전달할 수 있도록 관련 파일을
              첨부해주시면 감사하겠습니다.
            </FormText>
          </Grid>
        </FormGroup>

        <FormGroup check className='checkOuterBox'>
          <Input type='checkbox' />{' '}
          <Label check>상업적 광고나 홍보 글은 금지되어 있습니다.</Label>
        </FormGroup>
        <Grid className='WBFSbtnBox'>
          <Button className='WBFSbtn'>작성 완료</Button>
        </Grid>
      </Form>
    </Grid>
  );
};

export default WriteBoardForm;