import React from 'react';
import './Meal.css';
import { deleteMeal } from './IndexedDB';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import rubbishImage from './assets/rubbish.png'
const Meal = ({ meal, updateMeals, removeMeal }) => { // Add removeMeal as a prop
  const { id, name, price, description, quantity, image } = meal;

  const increment = () => {
    updateMeals(id, quantity + 1);
  };

  const decrement = () => {
    if (quantity > 0) {
      updateMeals(id, quantity - 1);
    }
  };

  const handleDelete = async () => {
    await deleteMeal(id);
    removeMeal(id); // Call removeMeal to update the state in App component
  };

  return (
    <div className="meal">
      <img src={image} alt={name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
      <div className="description">
        <h1>{name}</h1>
        <p>{description}</p>
      </div>
      <span>{quantity}</span>
      <div className="option">
        <button onClick={increment}><FontAwesomeIcon icon={faCaretUp} /></button>
        <button onClick={decrement}><FontAwesomeIcon icon={faCaretDown} /></button>
      </div>
      <p className="price">${(price)}</p>
      <button className='delete-button' onClick={handleDelete}>
      <img src={rubbishImage}/>
      </button>
    </div>
  );
};

export default Meal;
