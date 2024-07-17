import meal1Image from './assets/image1.jpg';
import meal2Image from './assets/image2.jpg';
import meal3Image from './assets/image3.jpg';

const DB_NAME = 'shoppingCart';
const DB_VERSION = 1;
const MEALS_STORE_NAME = 'meals';
const SHIPPING_STORE_NAME = 'shipping';
const ORDERS_STORE_NAME = 'orders';

let db;

const sampleMeals = [
  { id: 0, name: 'Italy Pizza', price: 681, description: 'Extra cheese and topping', quantity: 1, image: meal1Image },
  { id: 1, name: 'Combo Plate', price: 681, description: 'Extra cheese and topping', quantity: 1, image: meal2Image },
  { id: 2, name: 'Spanish Rice', price: 681, description: 'Extra garlic', quantity: 1, image: meal3Image }
];

const shippingCost = { id: 1, price: 4 };

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      console.log('Upgrading database...');
      db = event.target.result;
      const mealStore = db.createObjectStore(MEALS_STORE_NAME, { keyPath: 'id' });
      const shippingStore = db.createObjectStore(SHIPPING_STORE_NAME, { keyPath: 'id' });
      const ordersStore = db.createObjectStore(ORDERS_STORE_NAME, { keyPath: 'id', autoIncrement: true });

      sampleMeals.forEach(meal => mealStore.add(meal));
      shippingStore.add(shippingCost);
    };

    request.onsuccess = (event) => {
      console.log('Database opened successfully');
      db = event.target.result;
      resolve();
    };

    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
      reject('Database error: ' + event.target.errorCode);
    };
  });
};

export const getMeals = () => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([MEALS_STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(MEALS_STORE_NAME);
    const meals = [];

    const request = objectStore.openCursor();
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        meals.push(cursor.value);
        cursor.continue();
      } else {
        resolve(meals);
      }
    };

    request.onerror = (event) => {
      reject('Error fetching meals: ' + event.target.errorCode);
    };
  });
};

export const getShippingPrice = () => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SHIPPING_STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(SHIPPING_STORE_NAME);

    const request = objectStore.get(1);
    request.onsuccess = (event) => {
      resolve(event.target.result ? event.target.result.price : 4);
    };

    request.onerror = (event) => {
      reject('Error fetching shipping price: ' + event.target.errorCode);
    };
  });
};
export const deleteMeal = (id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([MEALS_STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(MEALS_STORE_NAME);
    const request = objectStore.delete(id);
    request.onsuccess = () => {
      console.log('Meal deleted successfully');
      resolve();
    };
    request.onerror = (event) => {
      console.error('Error deleting meal:', event.target.errorCode);
      reject('Error deleting meal: ' + event.target.errorCode);
    };
  });
};

const addMealsToIndexedDB = () => {
  sampleMeals.forEach(meal => {
    const request = db.transaction([MEALS_STORE_NAME], 'readwrite')
                      .objectStore(MEALS_STORE_NAME)
                      .add(meal);
    
    request.onsuccess = (event) => {
      console.log('Meal added to IndexedDB:', meal);
    };

    request.onerror = (event) => {
      console.error('Error adding meal to IndexedDB:', event.target.error);
    };
  });
};        

export const addOrder = (order) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([ORDERS_STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(ORDERS_STORE_NAME);

    const request = objectStore.add(order);
    request.onsuccess = () => {
      resolve('Order added successfully');
    };

    request.onerror = (event) => {
      reject('Error adding order: ' + event.target.errorCode);
    };
  });
};
