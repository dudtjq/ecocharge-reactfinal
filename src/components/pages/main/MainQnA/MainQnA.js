import React, { useEffect, useState } from 'react';
import './MainQnA.scss';
import { Button, Grid, Typography } from '@mui/material';
import MainQnAItem from './mainQnAItem/MainQnAItem';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../../../config/host-config';

const MainQnA = () => {
  const [qnaList, setQnaList] = useState([]);

  useEffect(() => {
    const fetchQnA = async () => {
      const res = await axios.get(`${API_BASE_URL}/main/qna`);
      setQnaList(res.data);
    };

    fetchQnA();
  }, []);

  return (
    <div className='main-qna-container'>
      <Typography variant='h4' className='qtitle'>
        Q & A
      </Typography>
      <Grid container className='qcontainer'>
        {qnaList.map((qna) => (
          <Grid item key={qna.qnaNo} className='qbox'>
            <Link to={`/qna/${qna.qnaNo}`} className='qbox-link'>
              <div className='qtitle'>{qna.qtitle}</div>
              <div className='qcontent'>{qna.qcontent}</div>
            </Link>
          </Grid>
        ))}
        <Grid
          item
          xs={12}
          style={{
            textAlign: 'center',
            marginTop: '-30px',
          }}
        >
          <Button
            className='qnaBtn'
            component={Link}
            to='/qna'
            variant='contained'
          >
            더보기
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default MainQnA;
