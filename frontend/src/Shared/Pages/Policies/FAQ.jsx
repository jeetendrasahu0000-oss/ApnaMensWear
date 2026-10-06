import PolicyLayout from "./PolicyLayout";

const FAQ = () => (
  <PolicyLayout title="Frequently Asked Questions">
    <h3>How do I place an order?</h3>
    <p>Browse products, add to cart, and proceed to checkout. You can pay via Razorpay or choose COD (if available).</p>

    <h3>How can I track my order?</h3>
    <p>Go to <strong>My Orders</strong> in your account or use the tracking link sent via SMS.</p>

    <h3>What if I receive a damaged product?</h3>
    <p>Contact us within 48 hours via the <a href="/contact">Contact page</a> — we'll arrange a replacement or refund.</p>

    <h3>Do you ship across India?</h3>
    <p>Yes, we ship to all serviceable pin codes across India.</p>
  </PolicyLayout>
);

export default FAQ;