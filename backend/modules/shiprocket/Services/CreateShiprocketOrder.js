import axios from "axios";
import { GetShiprocketToken } from "./GetShiprocketToken.js";



export const CreateShiprocketOrder = async (Data) => {
  try {
 

    const {order,user,dimensions} = Data

    console.log('dimentions ',dimensions)

    const token = await GetShiprocketToken();

    const payload = {

      order_id: order._id.toString(),
      order_date: new Date().toISOString().split("T")[0],

      pickup_location: "Home", 

      billing_customer_name:order.shippingAddress.fullName,
      billing_last_name: "",
      billing_address:order.shippingAddress.addressLine1 || "",
      billing_address_2:order.shippingAddress.addressLine2 || "",
      billing_city:order.shippingAddress.city,
      billing_pincode:order.shippingAddress.postalCode,
      billing_state:order.shippingAddress.state,
      billing_country:order.shippingAddress.country,
      billing_email:user?.email || "customer@example.com",
      billing_phone: order.shippingAddress.phone,
      shipping_is_billing: true,

      order_items: order.items.map((item) => ({

        name: item.productName,
        sku:item.product?._id?.toString() || item.productId?.toString(),
        units: item.quantity,
        selling_price: item.priceAtPurchase,
        discount: "",
        tax: "",

      })),

      payment_method: "Prepaid",

      sub_total: order.totalAmount,

      length: dimensions.length,
      breadth:dimensions.breadth,
      height: dimensions.height,
      weight: dimensions.weight,


    };

  

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log('Response =>',response.data)

    return {
      success: true,
      message:"successfully create a shipment",
      data: response.data,
      error: null,
    };

  } 
  catch (error) {
    console.log("Create Shiprocket Order Error:",error?.response?.data || error.message);

    return {
      success: false,
      message:'internall server error',
      data: null,
      error:
        error?.response?.data || error.message,
    };
  }
};


