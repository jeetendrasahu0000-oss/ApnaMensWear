import axios from "axios";


// ===========================================================================================================

// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({
//   path: path.resolve(__dirname, "../../../.env"),
// });

// console.log('file start running ')
// console.log('email',process.env.SHIPROCKET_EMAIL)
// console.log('password', process.env.SHIPROCKET_PASSWORD)
// console.log("cwd:", process.cwd());

// ===========================================================================================================

let shiprocketToken = null;
let tokenExpiry = null;


const GetShiprocketToken = async () => {
  try {

    if (
      shiprocketToken &&
      tokenExpiry &&
      Date.now() < tokenExpiry
    ) {
      return shiprocketToken;
    }

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
    );

    shiprocketToken = response.data.token;

    tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000;

    return shiprocketToken;
  } 
  catch (error) {
    console.log(error?.response?.data?.message ||"Failed to authenticate Shiprocket"  );
  }
};


export {GetShiprocketToken}