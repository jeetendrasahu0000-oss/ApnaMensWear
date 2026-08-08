import React, { useEffect, useState } from "react";
import api from "../../../../Api/Axios";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiShield,
} from "react-icons/fi";

import styles from "./UserDashbord.module.css";

import UserDetails from "./UserDetails";
import UserUpdate from "./UserUpdate";

const UserDashbord = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    GetUsers();
  }, []);

  const GetUsers = async () => {
    try {
      console.log('GetUsers')
      setLoading(true);

      const { data } = await api.get("/v1/user/admin");

      if (data.success) {
        setUsers(data.data || []);
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  const DeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const { data } = await api.post(
        `/v1/user/admin/remove/${userId}`
      );

      if (data.success) {
        alert(data.message);

        setUsers((prev) =>
          prev.filter(
            (user) => user._id !== userId
          )
        );
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.isActive
  ).length;

  const inactiveUsers = users.filter(
    (user) => !user.isActive
  ).length;

  const adminUsers = users.filter(
    (user) =>
      user.roles?.includes("admin")
  ).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>User Dashboard</h2>
      </div>

      {/* Stats */}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <FiUsers />

          <div>
            <span>Total Users</span>

            <h3>{totalUsers}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <FiUserCheck />

          <div>
            <span>Active Users</span>

            <h3>{activeUsers}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <FiUserX />

          <div>
            <span>Inactive Users</span>

            <h3>{inactiveUsers}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <FiShield />

          <div>
            <span>Admins</span>

            <h3>{adminUsers}</h3>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          Loading Users...
        </div>
      ) : (
        <>
          {/* Desktop Table */}

          <div className={styles.desktopTable}>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div
                        className={
                          styles.userInfo
                        }
                      >
                        <img
                          src={
                            user.profileImage ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt=""
                        />

                        <span>
                          {user.firstName}{" "}
                          {user.lastName}
                        </span>
                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      {user.phone ||
                        "N/A"}
                    </td>

                    <td>
                      {user.roles?.join(
                        ", "
                      )}
                    </td>

                    <td>
                      <span
                        className={
                          user.isActive
                            ? styles.active
                            : styles.inactive
                        }
                      >
                        {user.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        user.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <div
                        className={
                          styles.actions
                        }
                      >
                        <button
                          onClick={() =>
                            setSelectedUser(
                              user
                            )
                          }
                        >
                          <FiEye />
                        </button>

                        <button
                          onClick={() =>
                            setEditUser(
                              user
                            )
                          }
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          className={
                            styles.deleteBtn
                          }
                          onClick={() =>
                            DeleteUser(
                              user._id
                            )
                          }
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}

          <div className={styles.mobileCards}>
            {users.map((user) => (
              <div
                key={user._id}
                className={
                  styles.userCard
                }
              >
                <div
                  className={
                    styles.cardTop
                  }
                >
                  <img
                    src={
                      user.profileImage ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt=""
                  />

                  <div>
                    <h4>
                      {user.firstName}{" "}
                      {user.lastName}
                    </h4>

                    <p>
                      {user.email}
                    </p>

                    <p>
                      {user.phone ||
                        "No Phone"}
                    </p>
                  </div>
                </div>

                <div
                  className={
                    styles.cardMeta
                  }
                >
                  <span>
                    {user.roles?.join(
                      ", "
                    )}
                  </span>

                  <span
                    className={
                      user.isActive
                        ? styles.active
                        : styles.inactive
                    }
                  >
                    {user.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <div
                  className={
                    styles.cardActions
                  }
                >
                  <button
                    onClick={() =>
                      setSelectedUser(
                        user
                      )
                    }
                  >
                    <FiEye />
                  </button>

                  <button
                    onClick={() =>
                      setEditUser(
                        user
                      )
                    }
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    className={
                      styles.deleteBtn
                    }
                    onClick={() =>
                      DeleteUser(
                        user._id
                      )
                    }
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={() =>
            setSelectedUser(null)
          }
          // refreshUsers={GetUsers}
        />
      )}

      {editUser && (
        <UserUpdate
          user={editUser}
          onClose={() =>
            setEditUser(null)
          }
          refreshUsers={GetUsers}
        />
      )}
    </div>
  );
};

export default UserDashbord;

