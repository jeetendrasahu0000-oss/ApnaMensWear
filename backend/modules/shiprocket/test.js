import axios from 'axios'
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});



console.log('file start running ')

console.log('email',process.env.SHIPROCKET_EMAIL)
console.log('password', process.env.SHIPROCKET_PASSWORD)
console.log("cwd:", process.cwd());



const test = async () => {
  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
    );

    console.log(response.data);
    return response.data
  } 
  catch (error) {
    console.log(error.response?.data);
    console.log("MESSAGE:", error.message);
  console.log("RESPONSE:", error.response?.data);
  console.log("STATUS:", error.response?.status);
    return error.response?.data
  }
};

const testData = await test()

console.log(testData)
