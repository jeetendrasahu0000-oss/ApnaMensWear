import React from 'react';
import styles from './AllCategoryProduct.module.css';
import CategoryWiseProducts from './CategoryWiseProducts';
import { GetCategories } from '../../../../StataicData/StaticData';

const categories = GetCategories()

const AllCategoryProduct = () => {
  return (
    <div className={styles.container}>
      {categories.map((category) => (
        <CategoryWiseProducts
          key={category}
          category={category}
        />
      ))}
    </div>
  );
};

export default AllCategoryProduct;
