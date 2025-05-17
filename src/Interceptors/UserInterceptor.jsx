import axios from "axios"
import { toast } from "react-toastify"
import store from "../store/store"
import { logout } from "../store/slices/userAuthentication"
import { setTokens } from "../store/slices/userToken"
import.meta.env

const baseURL = import.meta.env.VITE_API_LOCAL_URL

const axiosInstance = axios.create({
  baseURL: `${baseURL}/auth`,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().userToken.user_access_token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (!error.response) {
      console.error("Network Error or No Response from Server!")
      return Promise.reject(error)
    }
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        
        const refreshToken = store.getState().userToken.user_refresh_token

        if (!refreshToken) {
          console.error("No refresh token found in Redux!")
          throw new Error("No refresh token available")
        }
        const { data } = await axios.post(
          `${baseURL}/auth/user_refresh_token`,
          {},
          {
              headers: {
                  Authorization: `Bearer ${refreshToken}`,
              },
              withCredentials: true,
          }
        )
        
        store.dispatch(
          setTokens({
            user_access_token: data.access_token,
            user_refresh_token: refreshToken,
          })
        )
        
        originalRequest.headers["Authorization"] = `Bearer ${data.access_token}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.log("Refresh Token Expired or Invalid!")
        store.dispatch(logout())
        window.location.assign("/UserLoginPage")
        return Promise.reject(refreshError)
      }
    }
    const Authenticated = store.getState().userAuth.isAuthenticated
    if (error.response.status === 403) {
      console.log("Permission Denied!")
    } else if (error.response.status === 404) {
      console.log("The requested resource was not found!")
    } else if (error.response.status >= 500) {
      console.log("Something went wrong. Please try again later.")
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
