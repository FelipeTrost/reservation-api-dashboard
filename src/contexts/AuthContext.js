import React, { useContext, useState, useEffect } from "react"

import refresh_token from "../utils/refresh_token";
import { setAccessToken } from "../utils/access_token";
import request from "../utils/request";
import { api_url } from "../config";
import Cookies from 'js-cookie';


const AuthContext = React.createContext()

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
      refresh_token()
      .then(() => {
        setLoggedIn(true)
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      })
  }, [])

  const login = async (username, password) => {
    try {
      const jsonResponse = await fetch(api_url + "/api/auth/", {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password})
          });

        const response = await jsonResponse.json();

        if(response.success && response.access_token){
            setAccessToken(response.access_token);
            setLoggedIn(true);
            return true
        }
    } catch (error) {
        console.error(error);
    }
    return false;
  };

  const logout = () => {
    Cookies.remove('jid');
    // Doing this causes a rerender, so if the user is in a private route he gets redirected to the login
    setLoggedIn(false);
  };

  const requestApi = async (...a) => {
    try {
      return await request(...a);
    } catch (error) {
      if(error.status === 403){
        setLoggedIn(false);
        alert("Please log in aggain");
      }
      return {};
    }
  }

  const value = {
    loggedIn,
    login,
    logout,
    requestApi
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}