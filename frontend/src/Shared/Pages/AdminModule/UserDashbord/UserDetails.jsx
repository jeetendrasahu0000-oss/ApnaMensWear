// import React, { useState } from "react";
// import api from "../../../../Api/Axios";
// import styles from "./UserDetails.module.css";

// const UserDetails = ({
//   user,
//   onClose,
//   refreshUsers,
// }) => {

//   const [formData, setFormData] = useState({
//     firstName: user.firstName || "",
//     lastName: user.lastName || "",
//     email: user.email || "",
//     phone: user.phone || "",
//     roles: user.roles || ["buyer"],
//     isActive: user.isActive,
//   });

//   const [loading, setLoading] = useState(false);

//   const HandleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const UpdateUser = async () => {
//     try {
//       setLoading(true);

//       const { data } = await api.post(
//         `/v1/user/admin/update/${user._id}`,
//         formData
//       );

//       if (data.success) {
//         console.log('response=>',data)
//         alert(data.message);
//         refreshUsers();
//         onClose();
//       }
//     }
//      catch (error) {
//         console.log(error)
//       alert(
//         error.response?.data?.message ||
//           "Failed to update user"
//       );
//     } 
//     finally {
//       setLoading(false);
//     }
//   };

//   const DeleteUser = async () => {
//     const confirmDelete = window.confirm(
//       "Delete this user?"
//     );

//     if (!confirmDelete) return;

//     try {
//       const { data } = await api.post(
//         `/v1/user/admin/remove/${user._id}`
//       );

//       if (data.success) {
//         alert(data.message);
//         refreshUsers();
//         onClose();
//       }
//     } catch (error) {
//       alert(
//         error.response?.data?.message ||
//           "Failed to delete user"
//       );
//     }
//   };

//   return (
//     <div
//       className={styles.overlay}
//       onClick={onClose}
//     >
//       <div
//         className={styles.modal}
//         onClick={(e) =>
//           e.stopPropagation()
//         }
//       >
//         <div className={styles.header}>
//           <h2>User Details</h2>

//           <button
//             className={styles.closeBtn}
//             onClick={onClose}
//           >
//             ✕
//           </button>
//         </div>

//         <div className={styles.profile}>
//           <img
//             src={
//               user.profileImage ||
//               "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//             }
//             alt={user.firstName}
//           />

//           <div>
//             <h3>
//               {user.firstName}{" "}
//               {user.lastName}
//             </h3>

//             <p>{user.email}</p>
//           </div>
//         </div>

//         <div className={styles.form}>
//           <div className={styles.inputGroup}>
//             <label>
//               First Name
//             </label>

//             <input
//               type="text"
//               name="firstName"
//               value={
//                 formData.firstName
//               }
//               onChange={
//                 HandleChange
//               }
//             />
//           </div>

//           <div className={styles.inputGroup}>
//             <label>
//               Last Name
//             </label>

//             <input
//               type="text"
//               name="lastName"
//               value={
//                 formData.lastName
//               }
//               onChange={
//                 HandleChange
//               }
//             />
//           </div>

//           <div className={styles.inputGroup}>
//             <label>Email</label>

//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={
//                 HandleChange
//               }
//             />
//           </div>

//           <div className={styles.inputGroup}>
//             <label>Phone</label>

//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={
//                 HandleChange
//               }
//             />
//           </div>

//           <div className={styles.inputGroup}>
//             <label>Role</label>

//             <select
//               value={
//                 formData.roles[0]
//               }
//               onChange={(e) =>
//                 setFormData(
//                   (prev) => ({
//                     ...prev,
//                     roles: [
//                       e.target.value,
//                     ],
//                   })
//                 )
//               }
//             >
//               <option value="buyer">
//                 Buyer
//               </option>

//               <option value="admin">
//                 Admin
//               </option>
//             </select>
//           </div>

//           <div className={styles.inputGroup}>
//             <label>Status</label>

//             <select
//               value={
//                 formData.isActive
//                   ? "active"
//                   : "inactive"
//               }
//               onChange={(e) =>
//                 setFormData(
//                   (prev) => ({
//                     ...prev,
//                     isActive:
//                       e.target
//                         .value ===
//                       "active",
//                   })
//                 )
//               }
//             >
//               <option value="active">
//                 Active
//               </option>

//               <option value="inactive">
//                 Inactive
//               </option>
//             </select>
//           </div>
//         </div>

//         {user.address && (
//           <div
//             className={
//               styles.addressBox
//             }
//           >
//             <h4>Address</h4>

//             <p>
//               {
//                 user.address
//                   .addressLine1
//               }
//             </p>

//             <p>
//               {
//                 user.address
//                   .addressLine2
//               }
//             </p>

//             <p>
//               {user.address.city},{" "}
//               {
//                 user.address
//                   .state
//               }
//             </p>

//             <p>
//               {
//                 user.address
//                   .country
//               }
//             </p>

//             <p>
//               {
//                 user.address
//                   .pinCode
//               }
//             </p>
//           </div>
//         )}

//         <div className={styles.actions}>
//           <button
//             className={
//               styles.updateBtn
//             }
//             onClick={UpdateUser}
//             disabled={loading}
//           >
//             {loading
//               ? "Updating..."
//               : "Update User"}
//           </button>

//           <button
//             className={
//               styles.deleteBtn
//             }
//             onClick={DeleteUser}
//           >
//             Delete User
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDetails;



import React from "react";
import styles from "./UserDetails.module.css";

const UserDetails = ({
  user,
  onClose,
}) => {
  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className={styles.header}>
          <h2>User Details</h2>

          <button
            className={styles.closeBtn}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className={styles.profile}>
          <img
            src={
              user.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={user.firstName}
          />

          <div>
            <h3>
              {user.firstName}{" "}
              {user.lastName}
            </h3>

            <p>{user.email}</p>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div>
            <label>Phone</label>
            <span>{user.phone || "-"}</span>
          </div>

          <div>
            <label>Role</label>
            <span>
              {user.roles?.join(", ")}
            </span>
          </div>

          <div>
            <label>Status</label>
            <span>
              {user.isActive
                ? "Active"
                : "Inactive"}
            </span>
          </div>

          <div>
            <label>User ID</label>
            <span>{user._id}</span>
          </div>
        </div>

        {user.address && (
          <div
            className={
              styles.addressBox
            }
          >
            <h4>Address</h4>

            <p>
              {
                user.address
                  .addressLine1
              }
            </p>

            <p>
              {
                user.address
                  .addressLine2
              }
            </p>

            <p>
              {user.address.city},{" "}
              {
                user.address
                  .state
              }
            </p>

            <p>
              {
                user.address
                  .country
              }
            </p>

            <p>
              {
                user.address
                  .pinCode
              }
            </p>
          </div>
        )}

        <div className={styles.dateBox}>
          <div>
            <label>
              Created At
            </label>

            <span>
              {new Date(
                user.createdAt
              ).toLocaleString()}
            </span>
          </div>

          <div>
            <label>
              Last Updated
            </label>

            <span>
              {new Date(
                user.updatedAt
              ).toLocaleString()}
            </span>
          </div>

          <div>
            <label>
              Last Login
            </label>

            <span>
              {user.lastLogin
                ? new Date(
                    user.lastLogin
                  ).toLocaleString()
                : "Never"}
            </span>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default UserDetails;

