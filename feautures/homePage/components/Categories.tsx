'use client';
import styles from '../styles/style.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  selectCategory,
  setNewItemCategory,
  setToggle,
  setCategories,
} from '@/redux/appSlice';
import { useEffect } from 'react';
import axios from 'axios';
const { categories_container } = styles;

const Categories = () => {
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `/api/categories?token=${localStorage.getItem('token')}`
        );
        dispatch(setCategories(res.data));
        dispatch(setToggle(res.data.length ? res.data[0].category : ''));
        dispatch(selectCategory(res.data.length ? res.data[0].category : ''));
        dispatch(
          setNewItemCategory(res.data.length ? res.data[0].category : '')
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);
  const { isSideBarOpen, toggleSelected, categories } = useSelector(
    (state: RootState) => state.app
  );
  const dispatch = useDispatch();
  const list = categories.list;
  return (
    <div className={`${categories_container}`}>
      <ToggleButtonGroup
        onChange={(e) => {
          //@ts-ignore
          const value = e.target.value;
          dispatch(setToggle(value));
          dispatch(setNewItemCategory(value));
          dispatch(selectCategory(value));
        }}
        orientation="horizontal"
        value={toggleSelected}
        exclusive
      >
        {list.map((item) => (
          <ToggleButton color="info" value={item.category} key={item._id}>
            {item.category}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
};
export default Categories;
