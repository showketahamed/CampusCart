const normalizeDate = (value) => (value instanceof Date ? value.toISOString() : value);
const toId = (value) => String(value);

export const serializeUser = (row) => ({
  _id: toId(row.id),
  name: row.name,
  email: row.email,
  role: row.role,
  phone: row.phone,
  studentId: row.student_id,
  status: row.status,
  createdAt: normalizeDate(row.created_at),
  updatedAt: normalizeDate(row.updated_at)
});

export const serializeVendor = (row, user = null) => ({
  _id: toId(row.id),
  userId: user
    ? user
    : row.user_id
      ? {
          _id: toId(row.user_id),
          name: row.user_name,
          email: row.user_email,
          status: row.user_status,
          role: row.user_role
        }
      : null,
  name: row.name,
  type: row.type,
  description: row.description,
  email: row.email,
  phone: row.phone,
  status: row.status,
  createdAt: normalizeDate(row.created_at),
  updatedAt: normalizeDate(row.updated_at)
});

export const serializeCategory = (row) => ({
  _id: toId(row.id),
  name: row.name,
  slug: row.slug,
  type: row.type,
  createdAt: normalizeDate(row.created_at),
  updatedAt: normalizeDate(row.updated_at)
});

export const serializeProduct = (row) => ({
  _id: toId(row.id),
  vendorId: row.vendor_id
    ? {
        _id: toId(row.vendor_id),
        name: row.vendor_name,
        type: row.vendor_type,
        description: row.vendor_description
      }
    : null,
  categoryId: row.category_id
    ? {
        _id: toId(row.category_id),
        name: row.category_name,
        slug: row.category_slug
      }
    : null,
  name: row.name,
  description: row.description,
  price: Number(row.price),
  stockStatus: row.stock_status,
  quantity: row.quantity,
  salesCount: row.sales_count,
  status: row.status,
  createdAt: normalizeDate(row.created_at),
  updatedAt: normalizeDate(row.updated_at)
});

export const serializeCartItem = (row) => ({
  _id: toId(row.id),
  userId: row.user_id ? toId(row.user_id) : undefined,
  productId: row.product_id ? serializeProduct(row) : null,
  quantity: row.quantity,
  createdAt: normalizeDate(row.created_at),
  updatedAt: normalizeDate(row.updated_at)
});

export const serializeOrder = (row) => ({
  _id: toId(row.id),
  userId: row.user_id
    ? {
        _id: toId(row.user_id),
        name: row.user_name,
        email: row.user_email
      }
    : null,
  vendorId: row.vendor_id
    ? {
        _id: toId(row.vendor_id),
        name: row.vendor_name
      }
    : null,
  orderNumber: row.order_number,
  subtotal: Number(row.subtotal),
  deliveryFee: Number(row.delivery_fee),
  total: Number(row.total),
  paymentMethod: row.payment_method,
  paymentStatus: row.payment_status,
  orderStatus: row.order_status,
  notes: row.notes,
  createdAt: normalizeDate(row.created_at),
  updatedAt: normalizeDate(row.updated_at)
});

export const serializeOrderItem = (row) => ({
  _id: toId(row.id),
  orderId: toId(row.order_id),
  productId: toId(row.product_id),
  productName: row.product_name,
  quantity: row.quantity,
  price: Number(row.price),
  total: Number(row.total),
  createdAt: normalizeDate(row.created_at),
  updatedAt: normalizeDate(row.updated_at)
});

export const serializePayment = (row) => ({
  _id: toId(row.id),
  orderId: row.order_id
    ? {
        _id: toId(row.order_id),
        orderNumber: row.order_number,
        total: Number(row.order_total)
      }
    : null,
  userId: row.user_id ? toId(row.user_id) : null,
  amount: Number(row.amount),
  method: row.method,
  status: row.status,
  transactionId: row.transaction_id,
  createdAt: normalizeDate(row.created_at),
  updatedAt: normalizeDate(row.updated_at)
});

export const serializeSubscription = (row) => ({
  _id: toId(row.id),
  userId: row.user_id
    ? {
        _id: toId(row.user_id),
        name: row.user_name
      }
    : null,
  vendorId: row.vendor_id
    ? {
        _id: toId(row.vendor_id),
        name: row.vendor_name
      }
    : null,
  productId: row.product_id
    ? {
        _id: toId(row.product_id),
        name: row.product_name
      }
    : null,
  frequency: row.frequency,
  quantity: row.quantity,
  nextOrderDate: normalizeDate(row.next_order_date),
  status: row.status,
  createdAt: normalizeDate(row.created_at),
  updatedAt: normalizeDate(row.updated_at)
});
