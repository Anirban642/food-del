import React, { useContext, useEffect, useState, useNavigate } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    
    // Validate cart is not empty
    if (getTotalCartAmount() === 0) {
      alert("Your cart is empty. Please add items before placing order.");
      return;
    }

    // Validate token exists
    if (!token) {
      alert("Please login to place order");
      return;
    }
    
    try {
      let orderItems = [];
      food_list.forEach((item) => {
        if (cartItems[item._id] > 0) {
          let itemInfo = { ...item };
          itemInfo.quantity = cartItems[item._id];
          orderItems.push(itemInfo);
        }
      });

      // Validate orderItems
      if (orderItems.length === 0) {
        alert("No items found in cart");
        return;
      }

      let orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 20,
      };
      
      // Debug logs
      console.log("Sending order data:", orderData);
      console.log("Using token:", token);
      console.log("API URL:", url + '/api/order/place');
      
      let response = await axios.post(url + '/api/order/place', orderData, { 
        headers: { 
          token: token,
          'Content-Type': 'application/json'
        } 
      });
      
      console.log("Full API response:", response);
      
      if (response.data.success) {
        const { session_url } = response.data;
        if (session_url) {
          console.log("Redirecting to:", session_url);
          window.location.replace(session_url);
        } else {
          alert("Payment URL not received from server");
          console.error("session_url is missing in response:", response.data);
        }
      } else {
        alert("Order failed: " + (response.data.message || "Unknown error"));
        console.error("Order placement failed:", response.data);
        console.error("Check your backend logs for detailed error information");
      }
    } catch (error) {
      console.error("Full error object:", error);
      
      if (error.response) {
        // Server responded with error status
        console.error("Error response data:", error.response.data);
        console.error("Error status:", error.response.status);
        alert(`Server error (${error.response.status}): ${error.response.data.message || 'Unknown server error'}`);
      } else if (error.request) {
        // Network error
        console.error("Network error:", error.request);
        alert("Network error: Unable to reach server");
      } else {
        console.error("Error message:", error.message);
        alert("Error: " + error.message);
      }
    }
  };


  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Address Details</p>
        <div className="multi-fileds">
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" />
          <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" />
        </div>
        <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email Address" />
        <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />
        <div className="multi-fileds">
          <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
          <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
        </div>
        <div className="multi-fileds">
          <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Pin Code" />
          <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()} ₹</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 20} ₹</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20} ₹</b>
            </div>
          </div>
          <button type="submit">Proceed to Payment</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

 