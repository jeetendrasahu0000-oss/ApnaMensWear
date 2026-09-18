import api from "./Axios";
import {
    ClearAccessToken,
    GetAccessToken,
    SetAccessToken,
} from "./TokenStore";
import { navigateTo } from "./navigation";

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
// RESPONSE INTERCEPTOR
// ======================================================

api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        // --------------------------------------------------
        // Handle 403 FORBIDDEN
        // FIX: window.location.href hard-reload karta tha (glitch).
        // Ab SPA navigate use karte hain — koi full reload nahi.
        // --------------------------------------------------

        if (
            error.response?.status === 403 &&
            error.response?.data?.error === "FORBIDDEN"
        ) {
            console.log("Access Denied. Returning to home page.");

            navigateTo("/");

            return Promise.reject(error);
        }

        // --------------------------------------------------
        // Only handle 401 errors
        // --------------------------------------------------

        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // --------------------------------------------------
        // Don't retry the same request
        // --------------------------------------------------

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        // --------------------------------------------------
        // Don't intercept refresh-token request itself
        // --------------------------------------------------

        if (
            originalRequest.url?.includes("/v1/user/refresh-token")
        ) {
            ClearAccessToken();

            return Promise.reject(error);
        }

        // ==================================================
        // Another refresh request is already running
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

            const response = await api.get(
                "/v1/user/refresh-token"
            );

            console.log(
                "Refresh API response:",
                response.data
            );

            const newAccessToken =
                response.data?.data?.AccessToken;

            if (!newAccessToken) {
                throw new Error(
                    "New AccessToken not received from refresh API"
                );
            }

            SetAccessToken(newAccessToken);

            console.log(
                "New AccessToken saved successfully"
            );

            resolveQueue(null, newAccessToken);

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

            resolveQueue(refreshError, null);

            ClearAccessToken();

            // --------------------------------------------------
            // FIX (root cause of "cart click -> random redirect"):
            // Pehle yahan window.location.href = "/signup" tha, jo
            // GUEST users ke liye bhi chal jaata tha aur poora page
            // force-redirect + reload ho jaata tha. Ab hum sirf token
            // clear karke reject karte hain — koi forced redirect nahi.
            // --------------------------------------------------

            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
    }
);

export default api;