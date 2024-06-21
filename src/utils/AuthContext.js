import React, { useEffect, useState } from 'react';

// 새로운 전역 컨텍스트 생성
const AuthContext = React.createContext({
  isLoggedIn: false, // 로그인 했는지의 여부
  userName: '',
  role: '',
  onLogout: () => {},
  onLogin: (token, userName, role) => {},
});

// 바로 위에서 생성한 Context를 제공하는 provider
// 이 컴포넌트를 통해 자식 컴포넌트(consumer)에게 인증 상태와 관련된 값, 함수를 전달할 수 있음.
export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');

  // 로그인 핸들러
  const loginHandler = (token, userName, role) => {
    // json에 담긴 인증 정보를 클라이언트에 보관
    // 1. 로컬 스토리지 - 브라우저가 종료 되어도 유지됨.
    // 2. 세션 스토리지 - 브라우저가 종료 되면 사라짐.
    console.log(token);
    localStorage.setItem('ACCESS_TOKEN', token.access_token);
    localStorage.setItem('REFRESH_TOKEN', token.refresh_token);
    localStorage.setItem('LOGIN_USERNAME', userName);
    setIsLoggedIn(true);
    setUserName(userName);
    setRole(role);
  };

  // 로그아웃 핸들러
  const logoutHandler = () => {
    localStorage.clear(); // 로컬스토리지 내용 전체 삭제(하나만 지우고 싶으면 -> remove)
    setIsLoggedIn(false);
    setUserName('');
    setRole('');
  };

  useEffect(() => {
    if (localStorage.getItem('ACCESS_TOKEN')) {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem('LOGIN_USERNAME'));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userName,
        role,
        onLogout: logoutHandler,
        onLogin: loginHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
