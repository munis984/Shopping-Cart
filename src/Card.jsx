
import React from 'react';
import './Card.css';
import person from './assets/person.jpg'
import mastercard from './assets/mastercard.png'
import visa from './assets/visa.png'
import rupay from './assets/rupay.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
const Card = ({ subtotal, shipping, total, onCheckout }) => {
  return (
    <div className="card">
      <div className='details'>
      <h1>Card Details</h1>
      <img className='person' src={person} alt="person"/>
      </div>
      <span>Card type</span>
      <ul className='cardNames'>
        <li><img src={mastercard}/></li>
        <li><img src={visa}/></li>
        <li><img src={rupay}/></li>
        <li>See all</li>
      </ul>
      <form>
        <li><label htmlFor="cardName">Name on card</label>
        <input type='text' id="cardName" placeholder='Name'></input>
      </li>
      <li><label htmlFor="cardNumber">Card Number</label>
        <input type='tel' inputMode="numeric" maxLength="19"  id="cardName" placeholder='1111 2222 3333 4444' required></input>
      </li>
      <ul>
      <li><label htmlFor="date">Expiration date</label>
        <input type='text' id="date" placeholder='mm/yy'></input>
      </li>
      <li><label htmlFor="cvv">CVV</label>
        <input type='text' id="cvv" placeholder='123' maxLength={3}></input>
      </li>
      </ul></form>
      <hr className='line'></hr>
      <p>Subtotal <span>${(subtotal)}</span></p>
      <p>Shipping <span>${(shipping)}</span></p>
      <p>Total(tax incl.) <span>${(subtotal + shipping)}</span></p>
      <button onClick={onCheckout}>${(subtotal + shipping)}<span>Checkout<FontAwesomeIcon icon={faArrowRight} /></span>
      </button>
      </div>
  );
};

export default Card;
