import React, { useState, useEffect } from 'react';
import { fetchItems, createItem, updateItem, deleteItem } from './db';

const Items = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    const loadItems = async () => {
      try {
        const itemsData = await fetchItems();
        setItems(itemsData);
      } catch (error) {
        console.error('Error loading items:', error);
      }
    };
    loadItems();
  }, []);

  const handleCreateItem = async () => {
    try {
      const createdItem = await createItem(newItem);
      setItems([...items, createdItem]);
      setNewItem('');
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleUpdateItem = async (id) => {
    try {
      const updatedItem = await updateItem(id, editName);
      const updatedItems = items.map(item => (item._id === id ? updatedItem : item));
      setItems(updatedItems);
      setEditItem(null);
      setEditName('');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteItem(id);
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div>
      <h1>Items</h1>
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Add new item"
      />
      <button onClick={handleCreateItem}>Add Item</button>
      <ul>
        {items.map(item => (
          <li key={item._id}>
            {editItem === item._id ? (
              <div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Edit item name"
                />
                <button onClick={() => handleUpdateItem(item._id)}>Update</button>
                <button onClick={() => setEditItem(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {item.name}
                <button onClick={() => {
                  setEditItem(item._id);
                  setEditName(item.name);
                }}>Edit</button>
                <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Items;
