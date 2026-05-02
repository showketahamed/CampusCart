import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

export default function OrderWaiting() {
  const { orderId } = useParams();
  return <DashboardLayout><div className="card p-8"><h1 className="text-3xl font-extrabold">Order Waiting</h1><p className="mt-3">Your order is queued successfully.</p><div className="mt-4"><Link className="btn-primary" to={`/order-status/${orderId}`}>Track Order</Link></div></div></DashboardLayout>;
}
