import React, { useEffect, useState } from 'react';
import './MainInfo.scss';
import { Button, Grid, Typography } from '@mui/material';
import MainInfoItem from './mainInfoItem/MainInfoItem.js';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../../../config/host-config.js';

const MainInfo = () => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const mainInfoRendering = async () => {
      const res = await axios.get(`${API_BASE_URL}/main/news`);
      setNewsList(res.data);
    };

    mainInfoRendering();
  }, []);

  return (
    <div className='main-info-container'>
      <Typography variant='h4' className='title'>
        새소식
      </Typography>
      <Grid
        container
        className='icontainer'
        style={{ width: '80%', height: '450px', marginTop: '20px' }}
      >
        {newsList.map((news) => (
          <MainInfoItem key={news.newsNo} data={news} />
        ))}
        <Grid
          item
          xs={12}
          style={{
            textAlign: 'center',
            marginTop: '-30px',
            marginBottom: '-20px',
          }}
        >
          <Button
            className='mainInfoDetailBtn'
            component={Link}
            to='/newInfo'
            variant='contained'
          >
            더보기
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default MainInfo;
