import PolicyLayout from "./PolicyLayout";
import styles from "./SizeGuide.module.css";

const SizeGuide = () => (
  <PolicyLayout title="Size Guide">
    <p>Use the chart below to find your perfect fit. Measurements are in inches.</p>

    <h3>T-Shirts & Shirts</h3>
    <table className={styles.table}>
      <thead>
        <tr><th>Size</th><th>Chest</th><th>Length</th><th>Shoulder</th></tr>
      </thead>
      <tbody>
        <tr><td>S</td><td>38</td><td>27</td><td>16.5</td></tr>
        <tr><td>M</td><td>40</td><td>28</td><td>17.5</td></tr>
        <tr><td>L</td><td>42</td><td>29</td><td>18.5</td></tr>
        <tr><td>XL</td><td>44</td><td>30</td><td>19.5</td></tr>
        <tr><td>XXL</td><td>46</td><td>31</td><td>20.5</td></tr>
      </tbody>
    </table>

    <h3>Jeans / Pants (Waist)</h3>
    <table className={styles.table}>
      <thead>
        <tr><th>Size</th><th>Waist (in)</th></tr>
      </thead>
      <tbody>
        <tr><td>28</td><td>28</td></tr>
        <tr><td>30</td><td>30</td></tr>
        <tr><td>32</td><td>32</td></tr>
        <tr><td>34</td><td>34</td></tr>
        <tr><td>36</td><td>36</td></tr>
      </tbody>
    </table>

    <h3>How to Measure</h3>
    <ul>
      <li><strong>Chest:</strong> Measure around the fullest part of your chest.</li>
      <li><strong>Length:</strong> From shoulder point to bottom hem.</li>
      <li><strong>Waist:</strong> Measure around your natural waistline.</li>
    </ul>
  </PolicyLayout>
);

export default SizeGuide;