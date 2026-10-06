import PolicyLayout from "./PolicyLayout";

const PrivacyPolicy = () => (
  <PolicyLayout title="Privacy Policy">
    <p>Your privacy matters to us. This policy explains how we collect, use and protect your information.</p>

    <h3>What We Collect</h3>
    <ul>
      <li>Name, email, phone, address</li>
      <li>Order history and preferences</li>
      <li>Device & browser information</li>
    </ul>

    <h3>How We Use It</h3>
    <p>To process orders, provide support, improve our services, and send offers (only with your consent).</p>

    <h3>Data Security</h3>
    <p>We use industry-standard encryption and never sell your data to third parties.</p>
  </PolicyLayout>
);

export default PrivacyPolicy;