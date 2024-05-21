'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import Login from '@/feautures/homePage/components/Login';
import Data from '@/feautures/homePage/components/Data';

export default function Home() {
  const { user } = useSelector((state: RootState) => state.app);
  return (
    <main>
      {!user && <Login />}
      {user && <Data />}
    </main>
  );
}
