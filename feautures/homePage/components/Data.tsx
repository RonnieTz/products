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
  const { showDelete, categories, newItem, user } = useSelector(
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
        { field: 'Name' },
        { field: 'Price' },
        { field: 'Quantity' },
        { field: 'Description' },
      ];
    return Object.keys(rowData[0])
      .filter((item) => item !== '__v')
      .map((key): ColDef => {
        return {
          field: key,
          headerValueGetter: (params) => {
            // @ts-ignore
            const title = params.colDef.field;
            return title === '_id' ? 'Delete' : title;
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
                Delete
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
          editable: true,
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
              headerName: 'Row',
              valueGetter: 'node.rowIndex + 1',
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
          <label>Add new item:</label>
          <input
            required
            onChange={(e) => {
              dispatch(setNewItemCategory(e.target.value));
            }}
            value={category}
            placeholder="Category..."
            type="text"
          />
          <input
            required
            onChange={(e) => {
              dispatch(setNewItemName(e.target.value));
            }}
            value={name}
            placeholder="Name..."
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
            placeholder="Price..."
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
            placeholder="Quantity..."
            type="text"
          />
          <input
            onChange={(e) => {
              dispatch(setNewItemDescription(e.target.value));
            }}
            value={description}
            placeholder="Description..."
            type="text"
          />

          <button>ADD</button>
        </form>
      </div>
    </div>
  );
};
export default Data;
