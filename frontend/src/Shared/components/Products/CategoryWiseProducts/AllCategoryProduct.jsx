import { useEffect, useState } from 'react'
import styles from './AllCategoryProduct.module.css';
import CategoryWiseProducts from './CategoryWiseProducts';
import { fetchCategories } from '../../../../Api/categories';

const AllCategoryProduct = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;

    fetchCategories()
      .then((loadedCategories) => {
        if (active) setCategories(loadedCategories.map(({ name }) => name));
      })
      .catch((error) => {
        console.error("Failed to load categories:", error);
      });

    return () => {
      active = false;
    };
  }, []);

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
