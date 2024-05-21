'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  user: string | null;
  form: {
    username: string;
    password: string;
    loading: boolean;
    error: string;
    save: boolean;
  };
  data: {
    rowData: {
      Name: string;
      Price: number;
      Quantity: number;
      Description: string;
      category: string;
      _id: string;
    }[];
  };
  newItem: {
    name: string;
    price: number | '';
    amount: number | '';
    description: string;
    category: string;
  };
  showDelete: boolean;
  isSideBarOpen: boolean;
  toggleSelected: string;
  categories: {
    list: { category: string; _id: string }[];
    selected: string;
  };
} = {
  user: null,
  form: { username: '', password: '', loading: false, error: '', save: false },
  data: {
    rowData: [],
  },
  newItem: { name: '', price: '', amount: '', description: '', category: '' },
  showDelete: false,
  isSideBarOpen: false,
  toggleSelected: '',
  categories: {
    list: [],
    selected: '',
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    setUsername: (state, action) => {
      state.form.username = action.payload;
    },
    setPassword: (state, action) => {
      state.form.password = action.payload;
    },

    setLoading: (state, action) => {
      state.form.loading = action.payload;
    },

    setError: (state, action) => {
      state.form.error = action.payload;
    },
    setSave: (state, action) => {
      state.form.save = action.payload;
    },
    setRowData: (state, action) => {
      state.data.rowData = action.payload;
    },

    setNewItemName: (state, action) => {
      state.newItem.name = action.payload;
    },
    setNewItemPrice: (state, action) => {
      state.newItem.price = action.payload;
    },
    setNewItemAmount: (state, action) => {
      state.newItem.amount = action.payload;
    },
    setNewItemDescription: (state, action) => {
      state.newItem.description = action.payload;
    },
    setNewItemCategory: (state, action) => {
      state.newItem.category = action.payload;
    },
    setShowDelete: (state, action) => {
      state.showDelete = action.payload;
    },
    setIsSideBarOpen: (state, action) => {
      state.isSideBarOpen = action.payload;
    },
    setToggle: (state, action) => {
      state.toggleSelected = action.payload;
    },
    setCategories: (state, action) => {
      state.categories.list = action.payload;
    },
    selectCategory: (state, action) => {
      state.categories.selected = action.payload;
    },
  },
});

export const {
  logout,
  setPassword,
  setUsername,
  setLoading,
  login,
  setError,
  setSave,
  setRowData,
  setNewItemName,
  setNewItemPrice,
  setNewItemAmount,
  setNewItemDescription,
  setShowDelete,
  setIsSideBarOpen,
  setToggle,
  selectCategory,
  setCategories,
  setNewItemCategory,
} = appSlice.actions;
export default appSlice.reducer;
