import React, { useEffect, useState } from 'react';
import Meal from './Meal';
import Card from './Card';
import { openDB, getMeals, getShippingPrice, addOrder, deleteMeal } from './IndexedDB';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
const App = () => {
  const [meals, setMeals] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const initializeApp = async () => {
      await openDB();
      const fetchedMeals = await getMeals();
      const shippingPrice = await getShippingPrice();
      setMeals(fetchedMeals);
      setShipping(shippingPrice);
      calculateTotals(fetchedMeals, shippingPrice);
    };
    initializeApp();
  }, []);

  const updateMeals = (id, quantity) => {
    const updatedMeals = meals.map(meal =>
      meal.id === id ? { ...meal, quantity } : meal
    );
    setMeals(updatedMeals);
    calculateTotals(updatedMeals, shipping);
  };

  const updateQuantity = (id, newQuantity) => {
    const updatedMeals = meals.map(meal => {
      if (meal.id === id) {
        return { ...meal, quantity: newQuantity };
      }
      return meal;
    });
    setMeals(updatedMeals);
  };

  const removeMeal = (id) => {
    const updatedMeals = meals.filter(meal => meal.id !== id);
    setMeals(updatedMeals);
    calculateTotals(updatedMeals, shipping);
  };

  // Calculate total number of items
  const totalItems = meals.reduce((total, meal) => total + meal.quantity, 0);

  const calculateTotals = (meals, shippingPrice) => {
    const subtotal = meals.reduce((acc, meal) => acc + meal.price * meal.quantity, 0);
    setSubtotal(subtotal);
    setTotal(subtotal + shippingPrice);
  };

  const handleCheckout = async () => {
    const order = {
      meals: meals.map(({ id, quantity }) => ({ id, quantity })),
      subtotal,
      shipping,
      total
    };
    try {
      await addOrder(order);
      alert('Thank you for your order!');
    } catch (error) {
      console.error('error', error);
    }
  };

  return (
    <div className="App">
      <div>
      <span className="shopContinue"><FontAwesomeIcon icon={faAngleLeft} />Shopping Continue</span>
      <hr></hr>
      <h2>Shopping cart</h2>
      <span className="numOfItems">You have {totalItems} item in your cart</span>
      <div className="meals">
        {meals.length > 0 ? (
          meals.map(meal => (
            <Meal key={meal.id} meal={meal} updateMeals={updateMeals} updateQuantity={updateQuantity} removeMeal={removeMeal} />
          ))
        ) : (
          <p>No meals available.</p>
        )}
      </div>
      </div>
      <div>
      <Card subtotal={subtotal} shipping={shipping} total={total} onCheckout={handleCheckout} />
      </div>
    </div>
    
  );
};

export default App;
