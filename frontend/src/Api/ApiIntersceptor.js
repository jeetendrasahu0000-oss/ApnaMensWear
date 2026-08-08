import api from './Axios'
import { ClearAccessToken, GetAccessToken, SetAccessToken } from './TokenStore';





api.interceptors.request.use((config) => {
  const token = GetAccessToken();
  // console.log('token',token)
  if (token) {
    // console.log('token =>',token)
    config.headers.Authorization = `Bearer ${token}`;
  }
  // console.log('headers=>',config.headers)
  return config;
});



// let navigate = useNavigate()
let isRefreshing = false;
let pendingQueue = [];

const resolveQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;



    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/v1/user/refresh-token")) {
      ClearAccessToken();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      console.log('hit refresh api...')
      const { data } = await api.get("/v1/user/refresh-token");

      const newAccessToken = data?.data?.AccessToken;
      SetAccessToken(newAccessToken);
      console.log("data",data)

      resolveQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } 
    catch (refreshError) {
      console.log('error =>',refreshError)
      resolveQueue(refreshError, null);
      ClearAccessToken();

     const errorCode = refreshError.response?.data?.error;
     alert(errorCode)
      if (
        refreshError.response?.status === 401 &&
        [
          "REFRESHTOKEN_MISSING",
          "REFRESH_TOKEN_REVOKED",
          "INVALID_REFRESH_TOKEN"
        ].includes(errorCode)
      ) {
        window.location.href = "/signup";
      }

      return Promise.reject(refreshError);
    } 
    finally {
      isRefreshing = false;
    }
  }
);

