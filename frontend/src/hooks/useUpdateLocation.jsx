import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useSelector } from 'react-redux'

function useUpdateLocation() {
    const {userData}=useSelector(state=>state.user)
 
    useEffect(()=>{
const updateLocation=async (lat,lon) => {
    try {
        const result=await axios.post(`${serverUrl}/api/user/update-location`,{lat,lon},{withCredentials:true})
        console.log(result.data)
    } catch (error) {
        // Only log errors that are not authentication-related (401/403)
        if (error.response && ![401, 403].includes(error.response.status)) {
            console.log('Error updating location:', error)
        }
    }
}

// Only update location if user is authenticated
if(userData) {
    navigator.geolocation.watchPosition((pos)=>{
        updateLocation(pos.coords.latitude,pos.coords.longitude)
    }, (error) => {
        console.log('Geolocation error:', error)
    })
}
    },[userData])
}

export default useUpdateLocation
