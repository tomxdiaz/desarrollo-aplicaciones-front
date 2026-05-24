import { useState, useEffect } from 'react';
import { orderService } from '../../services/order.service';
import MyOrdersList from './MyOrdersList';

const MyOrdersListScreen = () => {
  const [orders, setOrders] = useState<any[]>([]);

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

  if (!orders) return null;

  return <MyOrdersList orders={orders} />;
};

export default MyOrdersListScreen;
