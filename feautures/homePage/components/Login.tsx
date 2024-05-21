'use client';
import styles from '../styles/style.module.css';
import axios, { AxiosError } from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  setLoading,
  login,
  setPassword,
  setUsername,
  setError,
  setSave,
} from '@/redux/appSlice';
import { useEffect } from 'react';
const { form, inputs, button, message } = styles;

const Login = () => {
  const app = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const greetServer = async () => {
      try {
        const res = await axios.get(`/api/login?token=${token}`);
        dispatch(login(res.data.user));
      } catch (error) {
        console.log(error);
      }
    };
    if (token) {
      greetServer();
    }
  }, []);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          dispatch(setLoading(true));
          const res = await axios.post('/api/login', {
            username: app.form.username,
            password: app.form.password,
          });
          dispatch(setLoading(false));

          dispatch(login(res.data.user));
          dispatch(setError(''));
          dispatch(setUsername(''));
          dispatch(setPassword(''));
          if (app.form.save) {
            localStorage.setItem('username', app.form.username);
            localStorage.setItem('token', res.data.token);
          }
          console.log(res.data);
        } catch (error: AxiosError | any) {
          dispatch(setLoading(false));
          dispatch(setUsername(''));
          dispatch(setPassword(''));
          dispatch(setError(error.response.data));
          console.log(error);
        }
      }}
      className={form}
    >
      <input
        value={app.form.username}
        onChange={(e) => dispatch(setUsername(e.target.value))}
        className={inputs}
        placeholder="Username..."
        type="text"
        required
      />
      <input
        value={app.form.password}
        onChange={(e) => dispatch(setPassword(e.target.value))}
        className={inputs}
        type="password"
        required
        placeholder="Password..."
      />
      <label style={{ width: '30%' }} htmlFor="save">
        <input
          onChange={() => {
            dispatch(setSave(!app.form.save));
            if (!app.form.save) {
              localStorage.removeItem('username');
              localStorage.removeItem('password');
            }
          }}
          checked={app.form.save}
          style={{ scale: '1.5', marginLeft: '0.2rem' }}
          type="checkbox"
          name="save"
          id="save"
        />
        <span style={{ marginLeft: '1rem' }}>Remember me</span>
      </label>
      <button disabled={app.form.loading} className={button}>
        {!app.form.loading ? 'Login' : 'Loading...'}
      </button>
      <button
        style={{ width: '8%', height: '1.6rem' }}
        onClick={() => {
          dispatch(setUsername('Guest'));
          dispatch(setPassword('Guest'));
          dispatch(setSave(true));
        }}
        className={button}
      >
        Guest
      </button>
      <p className={message}>{app.form.error}</p>
    </form>
  );
};
export default Login;
