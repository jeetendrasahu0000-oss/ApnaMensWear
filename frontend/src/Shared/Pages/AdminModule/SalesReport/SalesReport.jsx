// SalesReport.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../../../../Api/Axios";
import styles from "./SalesReport.module.css";
import { TrendingUp, TrendingDown, IndianRupee, ShoppingBag, Calendar, BarChart3 } from "lucide-react";

const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const getMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getMonthLabel = (key) => {
  const [year, month] = key.split("-");
  return new Date(year, month - 1, 1).toLocaleString("en-US", { month: "short", year: "2-digit" });
};

const daysInMonth = (key) => {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month, 0).getDate();
};

const SalesReport = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonthKey, setSelectedMonthKey] = useState("");
  const [hovered, setHovered] = useState(null); // { key, x } tooltip state — shared by both charts

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/v1/order/admin");

      if (data.success) {
        const fetched = data.data.orders || [];
        setOrders(fetched);

        // default: latest month jisme data hai, wahi select ho
        if (fetched.length > 0) {
          const sorted = [...fetched].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setSelectedMonthKey(getMonthKey(new Date(sorted[0].createdAt)));
        }
      }
    } catch (error) {
      console.error("Failed to fetch sales data", error);
    } finally {
      setLoading(false);
    }
  };

  // revenue-worthy orders — cancelled orders ko revenue mein count nahi karte
  const revenueOrders = useMemo(
    () => orders.filter((o) => o.orderStatus !== "Cancelled"),
    [orders]
  );

  // ---------------- Overall stats ----------------
  const stats = useMemo(() => {
    const totalRevenue = revenueOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalOrders = revenueOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return { totalRevenue, totalOrders, avgOrderValue };
  }, [revenueOrders]);

  // ---------------- Monthly grouping ----------------
  const monthlyData = useMemo(() => {
    const map = {};

    revenueOrders.forEach((order) => {
      const key = getMonthKey(new Date(order.createdAt));
      if (!map[key]) map[key] = { key, revenue: 0, count: 0 };
      map[key].revenue += order.totalAmount || 0;
      map[key].count += 1;
    });

    return Object.values(map).sort((a, b) => (a.key > b.key ? 1 : -1));
  }, [revenueOrders]);

  // last 12 months (ya jitne available hon)
  const recentMonthly = useMemo(() => monthlyData.slice(-12), [monthlyData]);

  // ---------------- This month vs last month ----------------
  const monthComparison = useMemo(() => {
    if (recentMonthly.length === 0) return null;

    const current = recentMonthly[recentMonthly.length - 1];
    const previous = recentMonthly[recentMonthly.length - 2];

    if (!previous) return { current, change: null };

    const change =
      previous.revenue > 0
        ? ((current.revenue - previous.revenue) / previous.revenue) * 100
        : null;

    return { current, previous, change };
  }, [recentMonthly]);

  // ---------------- Day-wise grouping (for selected month) ----------------
  const dailyData = useMemo(() => {
    if (!selectedMonthKey) return [];

    const totalDays = daysInMonth(selectedMonthKey);
    const map = {};
    for (let d = 1; d <= totalDays; d++) {
      map[d] = { day: d, revenue: 0, count: 0 };
    }

    revenueOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      const key = getMonthKey(date);
      if (key === selectedMonthKey) {
        const day = date.getDate();
        map[day].revenue += order.totalAmount || 0;
        map[day].count += 1;
      }
    });

    return Object.values(map);
  }, [revenueOrders, selectedMonthKey]);

  const monthOptions = monthlyData.slice().reverse(); // newest first, for dropdown

  // ================= SKELETON UI =================
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Sales Report</h2>
        </div>

        <div className={styles.statsGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.statCard} style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 38, height: 38, borderRadius: 10 }} />
              <div style={{ flex: 1 }}>
                <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "60%", height: "10px" }} />
                <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "40%", height: "20px", marginTop: "8px" }} />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.chartCard}>
          <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "180px", height: "16px", marginBottom: "24px" }} />
          <div className={styles.skeletonChart}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`${styles.skeletonBar} ${styles.skeletonPulse}`}
                style={{ height: `${30 + Math.random() * 60}%`, animationDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "180px", height: "16px", marginBottom: "24px" }} />
          <div className={styles.skeletonChart}>
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className={`${styles.skeletonBar} ${styles.skeletonPulse}`}
                style={{ height: `${20 + Math.random() * 70}%`, animationDelay: `${i * 30}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ================= EMPTY STATE =================
  if (orders.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Sales Report</h2>
        </div>
        <div className={styles.emptyState}>
          <BarChart3 size={40} />
          <p>Abhi tak koi order nahi hai. Sales data yahan tab dikhega jab orders aayenge.</p>
        </div>
      </div>
    );
  }

  const maxMonthlyRevenue = Math.max(...recentMonthly.map((m) => m.revenue), 1);
  const maxDailyRevenue = Math.max(...dailyData.map((d) => d.revenue), 1);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Sales Report</h2>
        <p className={styles.subtitle}>Aapke store ka poora sales overview — total, monthly aur day-wise</p>
      </div>

      {/* ================= STATS ================= */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <IndianRupee size={19} />
          </div>
          <div>
            <span>Total Revenue</span>
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <ShoppingBag size={19} />
          </div>
          <div>
            <span>Total Orders</span>
            <h3>{stats.totalOrders}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BarChart3 size={19} />
          </div>
          <div>
            <span>Avg Order Value</span>
            <h3>{formatCurrency(stats.avgOrderValue)}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            {monthComparison?.change > 0 ? <TrendingUp size={19} /> : <TrendingDown size={19} />}
          </div>
          <div>
            <span>This Month</span>
            <h3>{formatCurrency(monthComparison?.current?.revenue || 0)}</h3>
            {monthComparison?.change !== null && monthComparison?.change !== undefined && (
              <p
                className={`${styles.changeTag} ${
                  monthComparison.change >= 0 ? styles.changeUp : styles.changeDown
                }`}
              >
                {monthComparison.change >= 0 ? "▲" : "▼"} {Math.abs(monthComparison.change).toFixed(1)}% vs last month
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ================= MONTHLY SALES CHART ================= */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3>
            <Calendar size={16} /> Monthly Sales
          </h3>
          <span className={styles.chartHint}>Last {recentMonthly.length} months</span>
        </div>

        <div className={styles.chart}>
          {recentMonthly.map((m) => (
            <div
              key={m.key}
              className={styles.barCol}
              onMouseEnter={() => setHovered({ scope: "month", key: m.key })}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered?.scope === "month" && hovered.key === m.key && (
                <div className={styles.tooltip}>
                  <strong>{formatCurrency(m.revenue)}</strong>
                  <span>{m.count} orders</span>
                </div>
              )}
              <div className={styles.barTrack}>
                <div
                  className={`${styles.bar} ${styles.barMonth}`}
                  style={{ height: `${(m.revenue / maxMonthlyRevenue) * 100}%` }}
                />
              </div>
              <span className={styles.barLabel}>{getMonthLabel(m.key)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= DAY-WISE SALES CHART ================= */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3>
            <BarChart3 size={16} /> Day-wise Sales
          </h3>

          <select
            className={styles.monthSelect}
            value={selectedMonthKey}
            onChange={(e) => setSelectedMonthKey(e.target.value)}
          >
            {monthOptions.map((m) => (
              <option key={m.key} value={m.key}>
                {getMonthLabel(m.key)}
              </option>
            ))}
          </select>
        </div>

        <div className={`${styles.chart} ${styles.chartDaily}`}>
          {dailyData.map((d) => (
            <div
              key={d.day}
              className={styles.barCol}
              onMouseEnter={() => setHovered({ scope: "day", key: d.day })}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered?.scope === "day" && hovered.key === d.day && (
                <div className={styles.tooltip}>
                  <strong>{formatCurrency(d.revenue)}</strong>
                  <span>{d.count} orders</span>
                </div>
              )}
              <div className={styles.barTrack}>
                <div
                  className={`${styles.bar} ${styles.barDay} ${d.revenue === 0 ? styles.barEmpty : ""}`}
                  style={{ height: `${d.revenue > 0 ? (d.revenue / maxDailyRevenue) * 100 : 2}%` }}
                />
              </div>
              <span className={styles.barLabelSmall}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MONTHLY BREAKDOWN TABLE ================= */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3>Monthly Breakdown</h3>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Avg / Order</th>
              </tr>
            </thead>
            <tbody>
              {monthOptions.map((m) => (
                <tr key={m.key}>
                  <td>{getMonthLabel(m.key)}</td>
                  <td>{m.count}</td>
                  <td>{formatCurrency(m.revenue)}</td>
                  <td>{formatCurrency(m.count > 0 ? m.revenue / m.count : 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;