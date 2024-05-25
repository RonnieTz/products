'use client';
import styles from '../styles/style.module.css';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the grid
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import axios from 'axios';
import {
  setNewItemAmount,
  setNewItemDescription,
  setNewItemName,
  setNewItemPrice,
  setNewItemCategory,
  setRowData,
  setCategories,
  selectCategory,
  setToggle,
} from '@/redux/appSlice';
import Categories from './Categories';

const { log } = console;

const { grid, input_container } = styles;

const Data = () => {
  const dispatch = useDispatch();

  const { rowData } = useSelector((state: RootState) => state.app.data);
  const { amount, description, name, price, category } = useSelector(
    (state: RootState) => state.app.newItem
  );
  const { showDelete, categories, newItem, user, language } = useSelector(
    (state: RootState) => state.app
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `/api/database?token=${localStorage.getItem('token')}`
        );

        dispatch(setRowData(res.data));
      } catch (error) {
        log(error);
      }
    };
    fetchData();
  }, []);
  const keys = (rowData: any) => {
    if (!rowData.length)
      return [
        { field: language === 'en' ? 'Name' : 'Όνομα προϊόντος' },
        { field: language === 'en' ? 'Price' : 'Τιμή' },
        { field: language === 'en' ? 'Quantity' : 'Ποσότητα' },
        { field: language === 'en' ? 'Description' : 'Περιγραφή' },
      ];
    return Object.keys(rowData[0])
      .filter((item) => item !== '__v')
      .map((key): ColDef => {
        return {
          field: key,
          headerValueGetter: (params) => {
            // @ts-ignore
            const title = params.colDef.field;
            switch (key) {
              case (key = 'Name'):
                return language === 'en' ? key : 'Όνομα';
              case (key = 'Price'):
                return language === 'en' ? key : 'Τιμή';
              case (key = 'Quantity'):
                return language === 'en' ? key : 'Ποσότητα';
              case (key = 'Description'):
                return language === 'en' ? key : 'Περιγραφή';
              default:
                return title === '_id'
                  ? language === 'en'
                    ? 'Delete'
                    : 'Διαγραφή'
                  : title;
            }
          },
          cellRenderer: (params: any) => {
            const title = params.colDef.field;
            return title === '_id' ? (
              <button
                style={{
                  border: '1px solid red',
                  padding: '0.2rem 0.5rem',
                  color: 'red',
                  cursor: 'pointer',
                }}
                onClick={() => deleteItem(params.value)}
              >
                {language === 'en' ? 'Delete' : 'Διαγραφή'}
              </button>
            ) : (
              params.value
            );
          },
          hide:
            (key === '_id' && !showDelete) ||
            key === 'category' ||
            key === 'user',
          pinned: key === '_id' ? 'right' : undefined,
          editable: key !== '_id' ? true : false,
        };
      });
  };

  const addNewItem = async () => {
    if (!name || !price || !amount) return;

    const res = await axios.post('/api/database', {
      Name: name,
      Price: Number(price),
      Quantity: Number(amount),
      Description: description,
      category: newItem.category,
      user,
    });

    dispatch(setRowData(res.data.products));
    dispatch(setCategories(res.data.categories));
    dispatch(selectCategory(newItem.category));
    dispatch(setToggle(newItem.category));
    dispatch(setNewItemName(''));
    dispatch(setNewItemPrice(''));
    dispatch(setNewItemAmount(''));
    dispatch(setNewItemDescription(''));
  };

  const deleteItem = async (id: string) => {
    const res = await axios.delete(`/api/database?id=${id}&user=${user}`);
    dispatch(setRowData(res.data.products));
    dispatch(setCategories(res.data.categories));
  };

  return (
    <div>
      <Categories />
      <div className={grid + ' ag-theme-quartz'}>
        <AgGridReact
          defaultColDef={{
            filter: true,
            valueSetter: (p) => {
              const newValue = p.newValue;
              const col = p.colDef.field;
              const row = { ...p.data, [col as string]: newValue };
              const sendPatch = async () => {
                const res = await axios.patch(`/api/database`, {
                  ...row,
                  user,
                });
                dispatch(setRowData(res.data));
              };
              sendPatch();
              return false;
            },
            cellStyle: {},
          }}
          onSortChanged={(e) => {
            e.api.refreshCells();
          }}
          onFilterChanged={(e) => {
            e.api.refreshCells();
          }}
          columnDefs={[
            {
              headerName: language === 'en' ? 'Row' : 'Αριθμός',
              valueGetter: 'node.rowIndex + 1',
              lockPosition: true,
              initialWidth: 80,
            },

            ...(keys(rowData) as any),
          ]}
          rowData={rowData.filter(
            (row) => row.category === categories.selected
          )}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNewItem();
          }}
          className={input_container}
        >
          <label>
            {language === 'en' ? 'Add new item:' : 'Νέο αντικείμενο:'}
          </label>
          <input
            required
            onChange={(e) => {
              dispatch(setNewItemCategory(e.target.value));
            }}
            value={category}
            placeholder={language === 'en' ? 'Category...' : 'Κατηγορία...'}
            type="text"
          />
          <input
            required
            onChange={(e) => {
              dispatch(setNewItemName(e.target.value));
            }}
            value={name}
            placeholder={language === 'en' ? 'Name...' : 'Όνομα...'}
            type="text"
          />
          <input
            required
            onChange={(e) => {
              const value = e.target.value;
              if (isNaN(Number(value))) return;
              dispatch(setNewItemPrice(value));
            }}
            value={price}
            placeholder={language === 'en' ? 'Price...' : 'Τιμή...'}
            type="text"
          />
          <input
            required
            onChange={(e) => {
              const value = e.target.value;
              if (isNaN(Number(value))) return;
              dispatch(setNewItemAmount(e.target.value));
            }}
            value={amount}
            placeholder={language === 'en' ? 'Quantity...' : 'Ποσότητα...'}
            type="text"
          />
          <input
            onChange={(e) => {
              dispatch(setNewItemDescription(e.target.value));
            }}
            value={description}
            placeholder={language === 'en' ? 'Description...' : 'Περιγραφή...'}
            type="text"
          />

          <button>{language === 'en' ? 'ADD' : 'Προσθήκη'}</button>
        </form>
      </div>
    </div>
  );
};
export default Data;
