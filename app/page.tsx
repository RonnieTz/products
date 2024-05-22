'use client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import Login from '@/feautures/homePage/components/Login';
import Data from '@/feautures/homePage/components/Data';

export default function Home() {
  const app = useSelector((state: RootState) => state.app);

  const { user } = app;
  return (
    <main>
      {!user && <Login />}
      {user && <Data />}
    </main>
  );
}
