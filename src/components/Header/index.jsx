import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slice/auth';

export const Header = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  const onClickLogout = () => {
    if (window.confirm('Are you sure you wont?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>MALENKOV BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Add post</Button>
                </Link>
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  Exit
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Sing up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
