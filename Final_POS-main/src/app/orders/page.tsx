
export default function OrdersPage() {
  const orders = [
    {
      id: "ORD001",
      customer: "Qudsia",
      total: 3500,
      status: "Pending",
    },
    {
      id: "ORD002",
      customer: "Ayesha",
      total: 2200,
      status: "Completed",
    },
  ];

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Total (PKR)</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">{order.customer}</td>
                <td className="p-2 border">{order.total}</td>
                <td className="p-2 border">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
