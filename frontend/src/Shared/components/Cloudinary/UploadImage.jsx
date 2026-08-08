import React, { useState } from "react";
import { FiTrash2, FiUpload } from "react-icons/fi";
import api from "../../../Api/Axios";
import styles from "./UploadImage.module.css";
import { useEffect } from "react";



{/* <UploadImage

    onChange={(data)=>{
        console.log('data=>',data)
    }}

    type={'product'}

/> */}

const UploadImage = ({ onChange , type ,maxImageCount=0 ,initialImages=[]}) => {

  console.log('INITIAL IMAGES +>',initialImages)

  const [file, setFile] = useState(null);
  const [images, setImages] = useState(initialImages);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  // useEffect(()=>{
  //   console.log('ya it running ',initialImages)
  //   setImages(initialImages)
  // },[initialImages])


  const handleSelect = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {

    if(maxImageCount && maxImageCount <= images.length){
        alert(`You can not upload more image limite excied the max limit is ${maxImageCount}`)
    }


      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post(
        `/v1/images/upload/${type}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadedImage = response.data.data;

      const updatedImages = [...images, uploadedImage];

      setImages(updatedImages);
      setFile(null);

      // Clear file input
      const input = document.getElementById("upload-image-input");
      if (input) input.value = "";

      if (onChange) {
        onChange(
          updatedImages.map((img) => ({
            url: img.url,
            public_id: img.public_id,
          }))
        );
      }
    } 
    catch (error) {
      console.error(error);
      alert(`Image upload failed  ${error.message}`);
    } 
    finally {
      setLoading(false);
    }
  };

  const handleDelete = async (public_id) => {
    try {
      setRemoveLoading(true);

      const confirmed = window.confirm("Are you sure you want to delete this image?");
      if (!confirmed) return;

      await api.delete("/v1/images/remove", {
        data: {
          public_id,
        },
      });

      const updatedImages = images.filter(
        (img) => img.public_id !== public_id
      );

      setImages(updatedImages);

      if (onChange) {
        onChange(
          updatedImages.map((img) => ({
            url: img.url,
            public_id: img.public_id,
          }))
        );
      }
    } 
    catch (error) {
      console.error(error);
      alert(`Failed to delete image  ${error.message}`);
    } 
    finally {
      setRemoveLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadRow}>
        <input
          id="upload-image-input"
          type="file"
          accept="image/*"
          onChange={handleSelect}
          className={styles.fileInput}
        />

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || loading}
          className={styles.uploadBtn}
        >
          <FiUpload />
          {loading
            ? "Uploading..."
            : removeLoading
                ? "Deleting..."
                : "Upload"}
        </button>
      </div>

      {images.length > 0 && (
        <div className={styles.gallery}>
          {images.map((image) => (
            <div
              key={image.public_id}
              className={styles.imageCard}
            >
              <a
                href={image.url}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={image.url}
                  alt="Uploaded"
                  className={styles.image}
                />
              </a>

              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() =>
                  handleDelete(image.public_id)
                }
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadImage;

