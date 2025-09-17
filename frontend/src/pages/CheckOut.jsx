import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { MdDeliveryDining } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import axios from 'axios';
import { FaMobileScreenButton } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { addMyOrder, setTotalAmount, clearCart } from '../redux/userSlice';

function CheckOut() {
  const { cartItems ,totalAmount,userData} = useSelector(state => state.user)
  const [addressInput, setAddressInput] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const navigate=useNavigate()
  const dispatch = useDispatch()
  const deliveryFee=totalAmount>500?0:40
  const AmountWithDeliveryFee=totalAmount+deliveryFee

  const handlePlaceOrder=async () => {
    // Validate required fields
    if (!addressInput || addressInput.trim() === '') {
      alert('Please enter a delivery address');
      return;
    }
    
    try {
      const result=await axios.post(`${serverUrl}/api/order/place-order`,{
        paymentMethod,
        deliveryAddress:{
          text:addressInput.trim()
        },
        totalAmount:AmountWithDeliveryFee,
        cartItems
      },{withCredentials:true})

      if(paymentMethod=="cod"){
      dispatch(addMyOrder(result.data))
      dispatch(clearCart())
      navigate("/order-placed")
      }else{
        const orderId=result.data.orderId
        const razorOrder=result.data.razorOrder
          openRazorpayWindow(orderId,razorOrder)
       }
    
    } catch (error) {
      console.log(error)
    }
  }

const openRazorpayWindow=(orderId,razorOrder)=>{

  const options={
 key:import.meta.env.VITE_RAZORPAY_KEY_ID,
 amount:razorOrder.amount,
 currency:'INR',
 name:"FoodWay",
 description:"Food Delivery Website",
 order_id:razorOrder.id,
 handler:async function (response) {
  try {
    const result=await axios.post(`${serverUrl}/api/order/verify-payment`,{
      razorpay_payment_id:response.razorpay_payment_id,
      orderId
    },{withCredentials:true})
        dispatch(addMyOrder(result.data))
        dispatch(clearCart())
      navigate("/order-placed")
  } catch (error) {
    console.log(error)
  }
 }
  }

  const rzp=new window.Razorpay(options)
  rzp.open()


}



  return (
    <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
      <div className=' absolute top-[20px] left-[20px] z-[10]' onClick={() => navigate("/")}>
        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
      </div>
      <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Checkout</h1>

        <section>
          <h2 className='text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800'><IoLocationSharp className='text-[#ff4d2d]' /> Delivery Location</h2>
          <div className='space-y-3'>
            <input 
              type="text" 
              className='w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' 
              placeholder='Enter your complete delivery address within the university campus (e.g., Room 101, Boys Hostel Block A, XYZ University)' 
              value={addressInput} 
              onChange={(e) => setAddressInput(e.target.value)} 
            />
            <p className='text-xs text-gray-500'>
              Please provide a detailed address including building name, room number, and any landmarks to help the delivery person find you easily.
            </p>
          </div>
        </section>

        <section>
          <h2 className='text-lg font-semibold mb-3 text-gray-800'>Payment Method</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"
              }`} onClick={() => setPaymentMethod("cod")}>

              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                <MdDeliveryDining className='text-green-600 text-xl' />
              </span>
              <div >
                <p className='font-medium text-gray-800'>Cash On Delivery</p>
                <p className='text-xs text-gray-500'>Pay when your food arrives</p>
              </div>

            </div>
            <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod === "online" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"
              }`} onClick={() => setPaymentMethod("online")}>

              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100'>
                <FaMobileScreenButton className='text-purple-700 text-lg' />
              </span>
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                <FaCreditCard className='text-blue-700 text-lg' />
              </span>
              <div>
                <p className='font-medium text-gray-800'>UPI / Credit / Debit Card</p>
                <p className='text-xs text-gray-500'>Pay Securely Online</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className='text-lg font-semibold mb-3 text-gray-800'>Order Summary</h2>
<div className='rounded-xl border bg-gray-50 p-4 space-y-2'>
{cartItems.map((item,index)=>(
  <div key={index} className='flex justify-between text-sm text-gray-700'>
<span>{item.name} x {item.quantity}</span>
<span>₹{item.price*item.quantity}</span>
  </div>
 
))}
 <hr className='border-gray-200 my-2'/>
<div className='flex justify-between font-medium text-gray-800'>
  <span>Subtotal</span>
  <span>{totalAmount}</span>
</div>
<div className='flex justify-between text-gray-700'>
  <span>Delivery Fee</span>
  <span>{deliveryFee==0?"Free":deliveryFee}</span>
</div>
<div className='flex justify-between text-lg font-bold text-[#ff4d2d] pt-2'>
    <span>Total</span>
  <span>{AmountWithDeliveryFee}</span>
</div>
</div>
        </section>
        <button className='w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold' onClick={handlePlaceOrder}> {paymentMethod=="cod"?"Place Order":"Pay & Place Order"}</button>

      </div>
    </div>
  )
}

export default CheckOut
