import React, { useEffect, useState } from 'react';
import api from '../../../../Api/Axios'
import ProductDesign from '../ProductDesign';
import styles from './GetTopRetedProducts.module.css';

const GetTopRetedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      console.log('fetched Top rated product....')
      const response = await api.get('/v1/products/top-rated');

      setProducts(response.data.products || response.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading Products...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Featured Products</h2>

      <div className={styles.productGrid}>
        {products.map((product) => (
          <ProductDesign
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default GetTopRetedProducts;
