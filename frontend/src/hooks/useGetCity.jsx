import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import {  setCurrentAddress, setCurrentCity, setCurrentState, setUserData } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useGetCity() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
    const apiKey=import.meta.env.VITE_GEOAPIKEY
    useEffect(()=>{
// Only get location if user is authenticated
if(userData) {
    navigator.geolocation.getCurrentPosition(async (position)=>{
        console.log(position)
        const latitude=position.coords.latitude
        const longitude=position.coords.longitude
        dispatch(setLocation({lat:latitude,lon:longitude}))
        
        try {
            // Use free OpenStreetMap Nominatim API instead of paid Geoapify
            const result = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`)
            
            console.log('Geocoding result:', result.data)
            
            const address = result.data.address || {}
            const city = address.city || address.town || address.village || address.county || 'Hyderabad'
            const state = address.state || 'Telangana'
            const fullAddress = result.data.display_name || `${city}, ${state}`
            
            dispatch(setCurrentCity(city))
            dispatch(setCurrentState(state))
            dispatch(setCurrentAddress(fullAddress))
            dispatch(setAddress(fullAddress))
        } catch (error) {
            console.log('Geocoding API error - using default location:', error.response?.status || error.message)
            // Set default city when API fails
            dispatch(setCurrentCity('Hyderabad'))
            dispatch(setCurrentState('Telangana'))
            dispatch(setCurrentAddress('Hyderabad, Telangana'))
            dispatch(setAddress('Hyderabad, Telangana'))
        }
    }, (error) => {
        console.log('Geolocation permission error:', error)
        // Set default location when geolocation fails
        dispatch(setCurrentCity('Hyderabad'))
        dispatch(setCurrentState('Telangana'))
    })
}
    },[userData])
}

export default useGetCity
