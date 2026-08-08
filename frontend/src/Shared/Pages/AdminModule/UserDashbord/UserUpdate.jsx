import React, { useState } from "react";
import api from "../../../../Api/Axios";
import styles from "./UserUpdate.module.css";

const UserUpdate = ({
  user,
  onClose,
  refreshUsers,
}) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    roles: user.roles || ["buyer"],
    isActive: user.isActive,

    address: {
      country: user.address?.country || "",
      state: user.address?.state || "",
      city: user.address?.city || "",
      pinCode: user.address?.pinCode || "",
      addressLine1: user.address?.addressLine1 || "",
      addressLine2: user.address?.addressLine2 || "",
    },
  });

  const HandleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const HandleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const UpdateUser = async () => {
    try {
      setLoading(true);

      const { data } = await api.post(
        `/v1/user/admin/update/${user._id}`,
        formData
      );

      if (data.success) {
        alert(data.message);

        refreshUsers();

        onClose();
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update user"
      );
    } finally {
      setLoading(false);
    }
  };

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
          <h2>Update User</h2>

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

        <div className={styles.section}>
          <h4>Basic Information</h4>

          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>First Name</label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={HandleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Last Name</label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={HandleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={HandleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={HandleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Role</label>

              <select
                value={formData.roles[0]}
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      roles: [
                        e.target.value,
                      ],
                    })
                  )
                }
              >
                <option value="buyer">
                  Buyer
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Status</label>

              <select
                value={
                  formData.isActive
                    ? "active"
                    : "inactive"
                }
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      isActive:
                        e.target.value ===
                        "active",
                    })
                  )
                }
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h4>Address Information</h4>

          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>
                Address Line 1
              </label>

              <input
                type="text"
                name="addressLine1"
                value={
                  formData.address
                    .addressLine1
                }
                onChange={
                  HandleAddressChange
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>
                Address Line 2
              </label>

              <input
                type="text"
                name="addressLine2"
                value={
                  formData.address
                    .addressLine2
                }
                onChange={
                  HandleAddressChange
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>City</label>

              <input
                type="text"
                name="city"
                value={
                  formData.address.city
                }
                onChange={
                  HandleAddressChange
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>State</label>

              <input
                type="text"
                name="state"
                value={
                  formData.address.state
                }
                onChange={
                  HandleAddressChange
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Country</label>

              <input
                type="text"
                name="country"
                value={
                  formData.address
                    .country
                }
                onChange={
                  HandleAddressChange
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Pin Code</label>

              <input
                type="text"
                name="pinCode"
                value={
                  formData.address
                    .pinCode
                }
                onChange={
                  HandleAddressChange
                }
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.updateBtn}
            onClick={UpdateUser}
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update User"}
          </button>

          <button
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserUpdate;  
