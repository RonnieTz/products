'use client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import styles from '../styles/style.module.css';
import { logout, setShowDelete } from '@/redux/appSlice';

const { userContainer, logoutButton, split } = styles;

const User = () => {
  const { user, showDelete, language } = useSelector(
    (state: RootState) => state.app
  );
  const dispatch = useDispatch();
  return (
    <div className={`${userContainer} ${user && split}`}>
      {user && (
        <>
          <span>{user}</span>
          <label htmlFor="delete">
            <input
              onChange={() => dispatch(setShowDelete(!showDelete))}
              checked={showDelete}
              style={{ marginRight: '1rem' }}
              id="delete"
              type="checkbox"
            />
            {language === 'en' ? `Delete Items` : 'Διαγραφή αντικειμένων'}
          </label>
          <button
            className={logoutButton}
            onClick={() => {
              dispatch(logout());
              localStorage.removeItem('token');
            }}
          >
            {language === 'en' ? 'Logout' : 'Αποσύνδεση'}
          </button>
        </>
      )}
    </div>
  );
};
export default User;
