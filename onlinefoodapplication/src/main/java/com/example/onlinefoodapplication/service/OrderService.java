package com.example.onlinefoodapplication.service;

import com.example.onlinefoodapplication.io.OrderRequest;
import com.example.onlinefoodapplication.io.OrderResponse;
import com.razorpay.RazorpayException;

import java.util.List;
import java.util.Map;

public interface OrderService {

    OrderResponse createOrderWithPayment(OrderRequest reuest) throws RazorpayException;

    void verifyPayment(Map<String, String> payemntData, String status);

    List<OrderResponse>getUserOrders();

    void removeOrder(Long orderId);

    List<OrderResponse> getOrdersOfAllUsers();

    void updateOrderStatus(Long orderId, String status);
}
