import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/client";
import { useNotify } from "../utils/useNotify";

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [notes, setNotes] = useState("");
  const [cart, setCart] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();
  const notify = useNotify();

  const loadCart = async () => {
    const { data } = await api.get("/cart");
    setCart(data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.productId?.price || 0) * Number(item.quantity || 0), 0),
    [cart]
  );
  const deliveryFee = 30;
  const total = subtotal + deliveryFee;

  const submit = async () => {
    if (!cart.length) {
      notify.notifyError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post("/orders/checkout", { paymentMethod, notes });
      notify.notifySuccess("Order placed successfully.");
      nav(`/order-waiting/${data._id}`);
    } catch (err) {
      notify.notifyError(err.response?.data?.message || "Order placement failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return <DashboardLayout>
    <h1 className="text-3xl font-extrabold">Checkout</h1>
    <div className="card p-4 space-y-3 max-w-xl">
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
        <p className="font-semibold">Order Summary</p>
        <p className="text-sm text-slate-600">Items: {cart.length}</p>
        <p className="text-sm text-slate-600">Subtotal: ৳{subtotal.toFixed(2)}</p>
        <p className="text-sm text-slate-600">Delivery: ৳{deliveryFee.toFixed(2)}</p>
        <p className="mt-1 font-bold">Total: ৳{total.toFixed(2)}</p>
      </div>
      <select className="input" value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)}>
        <option>Cash on Delivery</option><option>bKash</option><option>Nagad</option><option>Card</option>
      </select>
      <textarea className="input" rows="4" placeholder="Notes" value={notes} onChange={(e)=>setNotes(e.target.value)} />
      <button className="btn-primary disabled:opacity-60" disabled={submitting} onClick={submit}>
        {submitting ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  </DashboardLayout>;
}
