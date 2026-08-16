import api from "./Axios";
import {
    ClearAccessToken,
    GetAccessToken,
    SetAccessToken,
} from "./TokenStore";


// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

api.interceptors.request.use(
    (config) => {
        const token = GetAccessToken();

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// ======================================================
// REFRESH TOKEN MANAGEMENT
// ======================================================

let isRefreshing = false;

let pendingQueue = [];

const resolveQueue = (error, token = null) => {
    pendingQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });

    pendingQueue = [];
};


// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        // If request config is missing
        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Only handle 401 errors
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // Don't retry the same request again
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        // Don't intercept refresh-token request itself
        if (
            originalRequest.url?.includes("/v1/user/refresh-token")
        ) {
            ClearAccessToken();

            return Promise.reject(error);
        }


        // ==================================================
        // If another refresh request is already running
        // ==================================================

        if (isRefreshing) {
            return new Promise((resolve, reject) => {

                pendingQueue.push({
                    resolve,
                    reject,
                });

            })
                .then((newToken) => {

                    originalRequest._retry = true;

                    originalRequest.headers =
                        originalRequest.headers || {};

                    originalRequest.headers.Authorization =
                        `Bearer ${newToken}`;

                    return api(originalRequest);
                })
                .catch((queueError) => {
                    return Promise.reject(queueError);
                });
        }


        // ==================================================
        // Start refresh process
        // ==================================================

        originalRequest._retry = true;
        isRefreshing = true;

        try {

            console.log("AccessToken expired/missing.");
            console.log("Hit refresh API...");


            // Refresh token is expected in HTTP-only cookie
            const response = await api.get(
                "/v1/user/refresh-token"
            );


            console.log(
                "Refresh API response:",
                response.data
            );


            const newAccessToken =
                response.data?.data?.AccessToken;


            // ==================================================
            // New token not received
            // ==================================================

            if (!newAccessToken) {

                throw new Error(
                    "New AccessToken not received from refresh API"
                );
            }


            // Save new token
            SetAccessToken(newAccessToken);


            console.log(
                "New AccessToken saved successfully"
            );


            // ==================================================
            // Resolve all pending requests
            // ==================================================

            resolveQueue(null, newAccessToken);


            // ==================================================
            // Retry original request
            // ==================================================

            originalRequest.headers =
                originalRequest.headers || {};

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;


            return api(originalRequest);

        } catch (refreshError) {

            console.error(
                "Refresh token error:",
                refreshError
            );


            // Reject all waiting requests
            resolveQueue(refreshError, null);


            // Remove old AccessToken
            ClearAccessToken();


            const errorCode =
                refreshError.response?.data?.error;


            const status =
                refreshError.response?.status;


            console.log(
                "Refresh status:",
                status
            );

            console.log(
                "Refresh error code:",
                errorCode
            );


            // ==================================================
            // Refresh token invalid / missing
            // ==================================================

            if (
                status === 401 &&
                [
                    "REFRESHTOKEN_MISSING",
                    "REFRESH_TOKEN_REVOKED",
                    "INVALID_REFRESH_TOKEN",
                ].includes(errorCode)
            ) {

                window.location.href = "/signup";
            }


            return Promise.reject(refreshError);

        } finally {

            isRefreshing = false;
        }
    }
);