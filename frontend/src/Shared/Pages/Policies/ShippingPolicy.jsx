import PolicyLayout from "./PolicyLayout";

const ShippingPolicy = () => (
  <PolicyLayout title="Shipping Policy">
    <p>At Apna Mens Wear, we aim to deliver your orders quickly and safely across India.</p>

    <h3>Delivery Time</h3>
    <ul>
      <li>Metro cities: 3–5 business days</li>
      <li>Other cities: 5–7 business days</li>
      <li>Remote areas: 7–10 business days</li>
    </ul>

    <h3>Shipping Charges</h3>
    <p>Free shipping on all orders above ₹999. Orders below ₹999 are charged ₹49 flat.</p>

    <h3>Order Tracking</h3>
    <p>Once your order is shipped, you will receive a tracking link via SMS and email.</p>
  </PolicyLayout>
);

export default ShippingPolicy;