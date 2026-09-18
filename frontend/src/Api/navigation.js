// src/Api/navigation.js
// NAYI FILE
// Axios interceptor React component ke bahar hota hai, isliye useNavigate()
// directly wahan use nahi ho sakta. Ye chhota helper App.jsx se navigate
// function "register" karwata hai taaki interceptor SPA-style navigate kar sake
// (poora page reload kiye bina).

let navigateRef = null;

export const setNavigate = (navigateFn) => {
  navigateRef = navigateFn;
};

export const navigateTo = (path) => {
  if (navigateRef) {
    navigateRef(path);
  } else {
    // fallback agar kisi wajah se navigate register nahi hua
    window.location.href = path;
  }
};