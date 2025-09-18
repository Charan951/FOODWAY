import axios from 'axios'
import React, { useEffect, useRef } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyOrders, setUserData } from '../redux/userSlice'
import { setMyShopData } from '../redux/ownerSlice'

function useGetMyOrders() {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const lastFetchedUserId = useRef(null)
    
    useEffect(() => {
        // Skip if no userData or if it's the same user we already fetched for
        if (!userData || !userData._id) {
            console.log('useGetMyOrders: No userData available, skipping fetch')
            return
        }
        
        // Skip if we already fetched for this user
        if (lastFetchedUserId.current === userData._id) {
            console.log('useGetMyOrders: Already fetched for this user, skipping')
            return
        }
        
        console.log('useGetMyOrders: Starting fetch for user:', userData.role, userData._id)
        
        let isCancelled = false
        
        const fetchOrders = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/order/my-orders`, { withCredentials: true })
                
                // Check if component is still mounted and request wasn't cancelled
                if (!isCancelled) {
                    console.log('Orders fetched successfully:', result.data)
                    console.log('User role:', userData?.role)
                    dispatch(setMyOrders(result.data))
                    lastFetchedUserId.current = userData._id
                }
            } catch (error) {
                if (!isCancelled) {
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
        }
        
        fetchOrders()
        
        // Cleanup function to cancel request if component unmounts
        return () => {
            isCancelled = true
        }
    }, [userData, dispatch])
}

export default useGetMyOrders
