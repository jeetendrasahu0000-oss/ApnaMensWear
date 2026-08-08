
import React, { useEffect, useState } from "react";
import api from "../../../../Api/Axios";
import ProductDesign from "../ProductDesign";
import styles from "./CategoryWiseProducts.module.css";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CategoryWiseProducts = ({ category, limit = 10 }) => {

  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('fetched category wise product =>',category)
      const response = await api.get(
        `/v1/products/category/${category}?limit=${limit}&page=1`,
      );

      setProducts(response.data.data.products || []);
    } catch (error) {
      console.log("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{category}</h2>
        <h3  onClick={()=>{navigate(`/filtered/${category}`)}}>
          View All <FaArrowRight />
        </h3>
      </div>

      <div className={styles.productRow}>
        {products.map((product) => (
          <div key={product._id} className={styles.productItem}>
            <ProductDesign product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryWiseProducts;
