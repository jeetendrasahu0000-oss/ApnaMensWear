import "dotenv/config";
import mongoose from "mongoose";

await mongoose.connect(process.env.MONGO_URI);

const collection = mongoose.connection.collection("products");

const products = await collection.find({}).toArray();

console.log(`Found ${products.length} products`);

for (const product of products) {
  try {
    const updateData = {};

    // Remove old cover image URL
    if (typeof product.coverImage === "object") {
      updateData.coverImage = {
        // url: "",
        // public_id: "",
      };
    }

    // Remove old image URLs
    if (
      Array.isArray(product.images) &&
      product.images.length > 0 &&
      typeof product.images[0] === "string"
    ) {
      updateData.images = [];
    }

    if (Object.keys(updateData).length > 0) {
      await collection.updateOne(
        { _id: product._id },
        { $set: updateData }
      );

      console.log(`Updated ${product._id}`);
    }
  } catch (error) {
    console.error(`Failed ${product._id}`, error);
  }
}

console.log("Migration completed");

await mongoose.disconnect();
process.exit(0);