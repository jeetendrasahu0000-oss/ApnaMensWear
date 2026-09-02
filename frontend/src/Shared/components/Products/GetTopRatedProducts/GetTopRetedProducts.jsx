// GetTopRetedProducts.jsx
import React, { useEffect, useState } from 'react';
import api from '../../../../Api/Axios';
import ProductDesign from '../ProductDesign';
import styles from './GetTopRetedProducts.module.css';

const GetTopRetedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProducts = async () => {
    try {
      console.log('Fetching top rated products...');
      const response = await api.get('/v1/products/top-rated');
      
      // Handle different response structures
      const productData = response?.data?.products || response?.data?.data || response?.data || [];
      setProducts(Array.isArray(productData) ? productData : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching top rated products:', error);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading Products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={getProducts} className={styles.retryBtn}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>No top rated products available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>⭐ Featured Products</h2>
        <p className={styles.subtitle}>Top rated products loved by our customers</p>
      </div>

      <div className={styles.productGrid}>
        {products.map((product, index) => (
          <div 
            key={product?._id || index} 
            className={styles.productItem}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProductDesign product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetTopRetedProducts;