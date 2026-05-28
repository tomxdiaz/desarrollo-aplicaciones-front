import { useState, useEffect } from 'react';
import { orderService } from '../../services/order.service';
import MyOrdersList from './MyOrdersList';
import { Order } from '../../types/types';

const MyOrdersListScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myOrders = await orderService.getMyOrders();
        setOrders(myOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };

    fetchData();
  }, []);

  const handleCancelOrder = async (order: Order) => {
    try {
      const updatedOrder = await orderService.cancelMyOrder(String(order.id));

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.id === updatedOrder.id ? updatedOrder : currentOrder,
        ),
      );
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  if (!orders) return null;

  return <MyOrdersList orders={orders} onCancelOrder={handleCancelOrder} />;
};

export default MyOrdersListScreen;
