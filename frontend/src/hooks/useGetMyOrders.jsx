import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyOrders, setUserData } from '../redux/userSlice'
import { setMyShopData } from '../redux/ownerSlice'

function useGetMyOrders() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
  useEffect(()=>{
    if (!userData) {
      console.log('useGetMyOrders: No userData available, skipping fetch')
      return
    }
    
    console.log('useGetMyOrders: Starting fetch for user:', userData.role, userData._id)
    
  const fetchOrders=async () => {
    try {
           const result=await axios.get(`${serverUrl}/api/order/my-orders`,{withCredentials:true})
            console.log('Orders fetched successfully:', result.data)
            console.log('User role:', userData?.role)
            console.log('Orders data structure:', JSON.stringify(result.data, null, 2))
            dispatch(setMyOrders(result.data))
   


    } catch (error) {
        console.log('Error fetching orders:', error)
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            console.log('Error status:', error.response.status)
            console.log('Error message:', error.response.data?.message)
            
            if (error.response.status === 400 || error.response.status === 404) {
                // No orders found or user not found - set empty array
                dispatch(setMyOrders([]))
            } else {
                // Other server errors - still set empty array but log the error
                dispatch(setMyOrders([]))
            }
        } else if (error.request) {
            // Network error
            console.log('Network error - no response received')
            dispatch(setMyOrders([]))
        } else {
            // Other error
            console.log('Unexpected error:', error.message)
            dispatch(setMyOrders([]))
        }
    }
}
  fetchOrders()

 
  
  },[userData])
}

export default useGetMyOrders
