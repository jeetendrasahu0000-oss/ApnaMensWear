// UserDashbord.jsx
import React, { useEffect, useState, useRef } from "react";
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

const STAGGER_DELAY = 60; // rows ke beech gap (ms)

const UserDashbord = () => {
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState([]); // stats ke liye poori list, turant available
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  const staggerTimeouts = useRef([]);

  const clearStaggerTimeouts = () => {
    staggerTimeouts.current.forEach(clearTimeout);
    staggerTimeouts.current = [];
  };

  const revealStaggered = (batch) => {
    batch.forEach((user, i) => {
      const timeoutId = setTimeout(() => {
        setVisibleUsers((prev) => [...prev, user]);
      }, i * STAGGER_DELAY);
      staggerTimeouts.current.push(timeoutId);
    });
  };

  useEffect(() => {
    GetUsers();
    return () => clearStaggerTimeouts();
  }, []);

  const GetUsers = async () => {
    try {
      setLoading(true);
      clearStaggerTimeouts();
      setVisibleUsers([]);

      const { data } = await api.get("/v1/user/admin");

      if (data.success) {
        const fetched = data.data || [];
        setTotalUsers(fetched);
        if (fetched.length > 0) {
          revealStaggered(fetched);
        }
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

        setTotalUsers((prev) => prev.filter((user) => user._id !== userId));
        setVisibleUsers((prev) => prev.filter((user) => user._id !== userId));
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  const totalCount = totalUsers.length;

  const activeUsers = totalUsers.filter(
    (user) => user.isActive
  ).length;

  const inactiveUsers = totalUsers.filter(
    (user) => !user.isActive
  ).length;

  const adminUsers = totalUsers.filter(
    (user) =>
      user.roles?.includes("admin")
  ).length;

  // ---------------- Skeleton pieces ----------------
  const SkeletonStatCard = ({ delay = 0 }) => (
    <div className={styles.statCard} style={{ animationDelay: `${delay}ms` }}>
      <div className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 22, height: 22, borderRadius: 6 }} />
      <div>
        <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "60px", height: "9px" }} />
        <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "30px", height: "16px", marginTop: "6px" }} />
      </div>
    </div>
  );

  const SkeletonTableRow = ({ delay = 0 }) => (
    <tr className={styles.skeletonRow} style={{ animationDelay: `${delay}ms` }}>
      <td>
        <div className={styles.userInfo}>
          <div className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 34, height: 34, borderRadius: "50%" }} />
          <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "100px" }} />
        </div>
      </td>
      <td><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "130px" }} /></td>
      <td><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "80px" }} /></td>
      <td><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "50px" }} /></td>
      <td><div className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 60, height: 18, borderRadius: 30 }} /></td>
      <td><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "70px" }} /></td>
      <td><div className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 90, height: 30, borderRadius: 8 }} /></td>
    </tr>
  );

  const SkeletonUserCard = ({ delay = 0 }) => (
    <div className={styles.userCard} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.cardTop}>
        <div className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 46, height: 46, borderRadius: "50%" }} />
        <div style={{ flex: 1 }}>
          <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "80px", height: "12px" }} />
          <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "110px", height: "10px", marginTop: "6px" }} />
          <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "70px", height: "10px", marginTop: "4px" }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>User Dashboard</h2>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {loading ? (
          <>
            <SkeletonStatCard delay={0} />
            <SkeletonStatCard delay={60} />
            <SkeletonStatCard delay={120} />
            <SkeletonStatCard delay={180} />
          </>
        ) : (
          <>
            <div className={styles.statCard}>
              <FiUsers />
              <div>
                <span>Total Users</span>
                <h3>{totalCount}</h3>
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
          </>
        )}
      </div>

      {loading ? (
        <>
          {/* Desktop skeleton table */}
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
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonTableRow key={i} delay={i * 60} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile skeleton cards */}
          <div className={styles.mobileCards}>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonUserCard key={i} delay={i * 60} />
            ))}
          </div>
        </>
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
                {visibleUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={styles.animatedRow}
                    style={{ animationDelay: `${(index % 20) * 0.03}s` }}
                  >
                    <td>
                      <div className={styles.userInfo}>
                        <img
                          src={
                            user.profileImage ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt=""
                        />
                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>

                    <td>{user.email}</td>
                    <td>{user.phone || "N/A"}</td>
                    <td>{user.roles?.join(", ")}</td>

                    <td>
                      <span
                        className={
                          user.isActive ? styles.active : styles.inactive
                        }
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td>
                      <div className={styles.actions}>
                        <button onClick={() => setSelectedUser(user)}>
                          <FiEye />
                        </button>

                        <button onClick={() => setEditUser(user)}>
                          <FiEdit2 />
                        </button>

                        <button
                          className={styles.deleteBtn}
                          onClick={() => DeleteUser(user._id)}
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
            {visibleUsers.map((user, index) => (
              <div
                key={user._id}
                className={`${styles.userCard} ${styles.animatedRow}`}
                style={{ animationDelay: `${(index % 20) * 0.03}s` }}
              >
                <div className={styles.cardTop}>
                  <img
                    src={
                      user.profileImage ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt=""
                  />

                  <div>
                    <h4>
                      {user.firstName} {user.lastName}
                    </h4>
                    <p>{user.email}</p>
                    <p>{user.phone || "No Phone"}</p>
                  </div>
                </div>

                <div className={styles.cardMeta}>
                  <span>{user.roles?.join(", ")}</span>

                  <span
                    className={
                      user.isActive ? styles.active : styles.inactive
                    }
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className={styles.cardActions}>
                  <button onClick={() => setSelectedUser(user)}>
                    <FiEye />
                  </button>

                  <button onClick={() => setEditUser(user)}>
                    <FiEdit2 />
                  </button>

                  <button
                    className={styles.deleteBtn}
                    onClick={() => DeleteUser(user._id)}
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
          onClose={() => setSelectedUser(null)}
        />
      )}

      {editUser && (
        <UserUpdate
          user={editUser}
          onClose={() => setEditUser(null)}
          refreshUsers={GetUsers}
        />
      )}
    </div>
  );
};

export default UserDashbord;