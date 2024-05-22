'use client';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { changeLanguage } from '@/redux/appSlice';
const Language = () => {
  const { language } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  return (
    <ToggleButtonGroup
      sx={{ height: 25, marginLeft: 3 }}
      onChange={(e) => {
        //@ts-ignore
        dispatch(changeLanguage(e.target.value));
      }}
      value={language}
      exclusive
      color="info"
    >
      <ToggleButton value={'en'}>EN</ToggleButton>
      <ToggleButton value={'gr'}>GR</ToggleButton>
    </ToggleButtonGroup>
  );
};
export default Language;
