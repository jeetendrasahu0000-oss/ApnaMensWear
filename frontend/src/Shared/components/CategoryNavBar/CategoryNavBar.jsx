

import React from "react";
import styles from "./CategoryNavBar.module.css";
import { GetCategories } from "../../../StataicData/StaticData";
import { useNavigate } from "react-router-dom";

const Categories = GetCategories()

const categories = [
  {
    name: "Jackets",
    image: "https://i.pinimg.com/736x/bc/a0/21/bca02190c17bea5abc319d1b977a3f7d.jpg",
  },
  {
    name: "Hoodies",
    image: "https://i.pinimg.com/736x/c8/f0/e4/c8f0e40242940b089c20a2426a086dd4.jpg",
  },
  {
    name: "Jeans",
    image: "https://i.pinimg.com/736x/f3/c2/fb/f3c2fb651928d20226f6dc28e25b4da3.jpg",
  },

  {
    name: "Shirts",
    image: "https://i.pinimg.com/736x/4b/78/e4/4b78e4a57f9ebfadc42bf1d37a6bca65.jpg",
  },
  {
    name: "T-Shirts",
    image: "https://i.pinimg.com/1200x/f5/1a/ab/f51aabafcb14f4b13100502349ec0e45.jpg",
  },
  
  
  {
    name: "Formal",
    image: "https://i.pinimg.com/736x/e2/54/dc/e254dceecc61a5afc2e2dd998bf9a017.jpg",
  },
  {
    name: "Cargo",
    image: "https://i.pinimg.com/736x/37/34/00/3734002fd1cec34b7a33f0213923a986.jpg",
  },
  {
    name: "Shoes",
    image: "https://cdn-icons-png.flaticon.com/512/2589/2589903.png",
  },
];

// console.log("Categories =>", Categories);
// console.log("categories =>", categories);
// console.log("Categories length =>", Categories.length);
// console.log("categories length =>", categories.length);

const CategoryNavbar = () => {

  const navigate =useNavigate()
  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        {Categories.map((items,index) => {
        let item = categories[index]
        return (

          <div
            key={item.name}
            className={styles.category}
          >
            <div className={styles.imageBox} onClick={()=>{navigate(`/filtered/${Categories[index]}`)}}>
              <img
                src={item.image}
                alt={item.name}
                className={styles.image}
              />
            </div>

            <span>{item.name}</span>
          </div>
        )})}
      </div>
    </section>
  );
};

export default CategoryNavbar;



