import React, { useContext, useState, useEffect } from 'react';
import { AppBar, Grid, Toolbar, Link as MuiLink, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import '../../scss/Header.scss';
import AuthContext from '../../utils/AuthContext';
import { API_BASE_URL, USER } from '../../config/host-config';
import handleRequest from '../../utils/handleRequest';
import axiosInstance from '../../config/axios-config';

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      if (scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const { isLoggedIn, onLogout, phoneNumber, userName } =
    useContext(AuthContext);

  useEffect(() => {
    console.log(phoneNumber);
    console.log(userName);
    console.log(isLoggedIn);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const logoutHandler = async () => {
    const onSuccess = () => {
      onLogout();
      navigate('/login');
    };

    handleRequest(
      () => axiosInstance.get(`${API_BASE_URL}${USER}/logout`),
      onSuccess,
      onLogout,
      navigate,
    );
  };

  return (
    <AppBar
      position='fixed'
      style={{
        width: '100%',
        height: 120,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.9)' : '#fff',
        backdropFilter: isScrolled ? 'blur(1px)' : 'none',
        boxShadow: 'none',
        transition: 'background-color 0.3s, backdrop-filter 0.3s',
        borderBottom: '2px solid gray',
      }}
    >
      <Toolbar>
        <Grid container justifyContent='space-between'>
          <Grid item flex={2} style={{ display: 'flex' }}>
            <Link
              to='/'
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <img
                src='https://s3.ap-northeast-2.amazonaws.com/ecocharge.co.kr/mainLogo.png'
                alt='Logo'
                style={{
                  width: 200,
                  paddingTop: 10,
                  marginLeft: 50,
                  paddingBottom: 10,
                }}
              />
            </Link>
          </Grid>
          <Grid
            item
            flex={6}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {[
              { to: '/carList', text: '보조금 지원 차종' },
              { to: '/findCharge', text: '충전소 찾기' },
              { to: '/board', text: '게시판' },
              isLoggedIn && { to: '/myPage', text: '마이페이지' },
              {
                to: '/qna',
                text: 'Q & A',
                style: {
                  marginLeft: '-70px', // 예시로 추가한 스타일
                },
              },
            ].map((link, index) => (
              <MuiLink
                key={index}
                className='header-link'
                component={Link}
                to={link.to}
                underline='none'
                color='black'
                marginRight='60'
                fontSize='20px'
                fontWeight='700'
                textAlign='center'
                paddingRight='80px'
                style={{
                  ...(link.style && !isLoggedIn ? link.style : {}), // isLoggedIn이 false이고, 링크에 style이 있으면 적용
                }}
              >
                {link.text}
              </MuiLink>
            ))}
          </Grid>
          <Grid
            item
            flex={2}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isLoggedIn ? (
              <Button
                className='loginBtn'
                onClick={logoutHandler}
                variant='outlined'
                style={{
                  width: '130px',
                  height: '40px',
                  color: 'black',
                  borderColor: 'black',
                  fontFamily: 'Jua',
                  fontSize: '15px',
                  borderWidth: '3px',
                  fontWeight: '600',
                  marginTop: '30px',
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                className='loginBtn'
                onClick={handleLogin}
                variant='outlined'
                style={{
                  width: '130px',
                  height: '40px',
                  color: 'black',
                  borderColor: 'black',
                  fontFamily: 'Jua',
                  fontSize: '15px',
                  borderWidth: '3px',
                  fontWeight: '600',
                  marginTop: '30px',
                }}
              >
                Login
              </Button>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
