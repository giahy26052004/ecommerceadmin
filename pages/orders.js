import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Recipient</th>
            <th>Products</th>
            <th>Phone</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order, index) => {
              return (
                <tr key={index}>
                  <td>{order._id}</td>
                  <td>{order.name}</td>
                  <td>
                    {order.line_items.map((item) => {
                      return (
                        <>
                          {item.price_data.product_data.name} x {item.quantity}{" "}
                          <br></br>
                        </>
                      );
                    })}
                  </td>

                  <td>{order.phone}</td>
                  <td>{order.createdAt.replace("T", " ").substring(0,19)}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </Layout>
  );
}

export default Orders;
