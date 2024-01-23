// 실제로 로그인 해볼 수 있게 하는 코드2 :세션 쿠키를 사용, 쿠키가 클라이언트에 저장되어 세션 식별하는 데 사용.
// 사용자가 로그인하면 서버는 쿠키를 생성하고 HTTP 응답 헤더를 통해 클라이언트에 전송

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import Logo from './Logo';
import Hamburger from './Hamburger';
import Nav from './Nav';
import styles from './Header.module.scss';
import { NavigateHome } from '../../hooks/hook';

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!document.cookie); // 로그인 상태를 체크하여 useState에 설정
  const navigate = useNavigate()

  const handleNavMenu = () => {
    setIsNavOpen(!isNavOpen);
  };

  // 가상의 로그인 함수
  const login = () => {
    // 로그인이 성공했다고 가정하고, 쿠키를 설정
    document.cookie = 'session=YOUR_SESSION_ID';
    setIsLoggedIn(true); // 로그인 상태 true로 설정
    navigate('/login');
  };

  // 가상의 로그아웃 함수
  const logout = () => {
    // 로그아웃 시 쿠키 제거
    document.cookie =
      'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setIsLoggedIn(false); // 로그인 상태 false로 설정
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.listWrapper}>
          <ul>
            <li>
              <Hamburger
                className={styles.hamburger}
                clickHandler={handleNavMenu}
              />
              <Nav isNavOpen={isNavOpen} isLoggedIn={isLoggedIn} />
            </li>
            <li onClick={NavigateHome}>
              <Link to="/" className={styles.iconWrapper}>
                <Logo />
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <div className={styles.spacing}>
                  <button onClick={handleLogout}>Logout</button>
                  <button onClick={() => navigate('/accountedit')}>
                    My page
                  </button>
                </div>
              ) : (
                <button onClick={login}>Login</button>
              )}
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}

export default Header;
