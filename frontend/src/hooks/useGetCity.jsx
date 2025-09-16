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
            const result=await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
            console.log(result.data)
            dispatch(setCurrentCity(result?.data?.results[0].city||result?.data?.results[0].county))
            dispatch(setCurrentState(result?.data?.results[0].state))
            dispatch(setCurrentAddress(result?.data?.results[0].address_line2 || result?.data?.results[0].address_line1 ))
            dispatch(setAddress(result?.data?.results[0].address_line2))
        } catch (error) {
            console.log('Geocoding API error - using default location:', error.response?.status)
            // Set default city when API fails
            dispatch(setCurrentCity('Hyderabad'))
            dispatch(setCurrentState('Telangana'))
            dispatch(setCurrentAddress('Hyderabad, Telangana'))
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
