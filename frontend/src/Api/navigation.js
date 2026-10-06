// src/Api/navigation.js
// Axios interceptor React component ke bahar hota hai, isliye useNavigate()
// directly wahan use nahi ho sakta. Ye helper App.jsx se navigate function
// "register" karwata hai taaki interceptor SPA-style navigate kar sake.

let navigateRef = null;
let currentPath = "/";

export const setNavigate = (navigateFn) => {
  navigateRef = navigateFn;
};

export const navigateTo = (path, options = {}) => {
  // Guard: invalid path
  if (!path || typeof path !== "string") {
    console.warn("[navigation] Invalid path passed to navigateTo:", path);
    return;
  }

  // Guard: same route pe dobara navigate karne se React Router warning deta hai
  if (path === currentPath && !options.replace) {
    return;
  }

  if (navigateRef) {
    try {
      navigateRef(path, options);
      currentPath = path;
    } catch (error) {
      console.error("[navigation] navigate() failed, falling back:", error);
      window.location.href = path;
    }
  } else {
    // Fallback — agar navigate register nahi hua (jaise app boot ke time)
    console.warn("[navigation] navigate not registered, using window.location for:", path);
    window.location.href = path;
  }
};

// Optional: helps components know if navigation is ready
export const isNavigationReady = () => Boolean(navigateRef);

// Optional: allows us to know the current tracked path
export const getCurrentPath = () => currentPath;