import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function useGetCurrentUser() {
    const dispatch=useDispatch()
  useEffect(()=>{
  const fetchUser=async () => {
    try {
           const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
            dispatch(setUserData(result.data))
  
    } catch (error) {
        // Only log errors that are not authentication-related (401/403)
        if (error.response && ![401, 403].includes(error.response.status)) {
            console.log('Error fetching current user:', error)
        }
        // For authentication errors, silently handle - user is not logged in
    }
}
fetchUser()
 
  },[])
}

export default useGetCurrentUser
