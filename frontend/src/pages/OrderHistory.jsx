import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/client";
import OrderCard from "../components/OrderCard";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get("/orders").then((r) => setOrders(r.data)); }, []);
  return <DashboardLayout><h1 className="text-3xl font-extrabold">Order History</h1><div className="grid gap-3">{orders.map((o)=><OrderCard key={o._id} order={o}><Link className="btn mt-3 border" to={`/order-status/${o._id}`}>View</Link></OrderCard>)}</div></DashboardLayout>;
}
