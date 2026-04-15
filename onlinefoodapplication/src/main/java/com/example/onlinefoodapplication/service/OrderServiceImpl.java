package com.example.onlinefoodapplication.service;

import com.example.onlinefoodapplication.entity.OrderEntity;
import com.example.onlinefoodapplication.io.OrderRequest;
import com.example.onlinefoodapplication.io.OrderResponse;
import com.example.onlinefoodapplication.repository.CartRepository;
import com.example.onlinefoodapplication.repository.OrderRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;



import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService{

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CartRepository cartRepository;

    @Value("${razorpay_key}")
    private String RAZORPAY_KEY;
    @Value("${razorpay_secret}")
    private String RAZORPAY_SECRET_KEY;
    @Override
    public OrderResponse createOrderWithPayment(OrderRequest request) throws RazorpayException {
        OrderEntity newOrder = convertTOEntity(request);
        newOrder = orderRepository.save(newOrder);

//        create Razorpay payment order
        RazorpayClient razorpayClient = new RazorpayClient(RAZORPAY_KEY, RAZORPAY_SECRET_KEY);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int)(newOrder.getAmount() * 100));
        orderRequest.put("currency", "INR");
        orderRequest.put("payment_capture",1);
        Order razorpayOrder =  razorpayClient.orders.create(orderRequest);
        newOrder.setRazorpayOrderId(razorpayOrder.get("id"));
        Long loggedUserId = userService.findByUserId();
        newOrder.setUserId(String.valueOf(loggedUserId));
        newOrder = orderRepository.save(newOrder);
        return convertToResponse(newOrder);
    }

    @Override
    @Transactional
    public void verifyPayment(Map<String, String> paymentData, String status) {

        String razorpayOrderId = paymentData.get("razorpay_order_id");
        String razorpayPaymentId = paymentData.get("razorpay_payment_id");
        String razorpaySignature = paymentData.get("razorpay_signature");

        System.out.println("ORDER ID: " + razorpayOrderId);
        System.out.println("PAYMENT ID: " + razorpayPaymentId);
        System.out.println("SIGNATURE: " + razorpaySignature);

        System.out.println("Finding order: " + razorpayOrderId);

        OrderEntity existingOrder =
                orderRepository.findByRazorpayOrderId(razorpayOrderId)
                        .orElseThrow(() -> new RuntimeException("Order Not Found"));

        // 🔥 VERIFY SIGNATURE FIRST
        boolean isValid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        if (!isValid) {
            existingOrder.setPaymentStatus("FAILED");
            orderRepository.save(existingOrder);
            throw new RuntimeException("Payment signature mismatch!");
        }

        existingOrder.setPaymentStatus("PAID");
        existingOrder.setRazorpayPaymentId(razorpayPaymentId);
        existingOrder.setRazorpaySignature(razorpaySignature);

        orderRepository.save(existingOrder);

        cartRepository.deleteByUserId(existingOrder.getUserId());
    }

    @Override
    public List<OrderResponse> getUserOrders() {
        String loggedInUserId = String.valueOf(userService.findByUserId());
        List<OrderEntity> list = orderRepository.findByUserId(loggedInUserId);
        return list.stream().map(orderEntity -> convertToResponse(orderEntity)).collect(Collectors.toList());
    }

    @Override
    public void removeOrder(Long orderId) {
        orderRepository.deleteById(orderId);

    }

    @Override
    public List<OrderResponse> getOrdersOfAllUsers() {
        List<OrderEntity> list = orderRepository.findAll();
        return list.stream().map(entity -> convertToResponse(entity)).collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(Long orderId, String status) {
        OrderEntity entity = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order Not Found"));
        entity.setOrderStatus(status);
        orderRepository.save(entity);
    }

    private OrderResponse convertToResponse(OrderEntity newOrder) {
        return OrderResponse.builder()
                .id(newOrder.getId())
                .amount(newOrder.getAmount())
                .userAddress(newOrder.getUserAddress())
                .userId(newOrder.getUserId())
                .razorpayOrderId(newOrder.getRazorpayOrderId())
                .paymentStatus(newOrder.getPaymentStatus())
                .orderStatus(newOrder.getOrderStatus())
                .email(newOrder.getEmail())
                .phoneNumber(newOrder.getPhoneNumber())
                .orderedItems(newOrder.getOrderItems())
                .build();
    }

    private OrderEntity convertTOEntity(OrderRequest request) {
        if (request.getOrderItemList() == null) {
            throw new RuntimeException("Order items cannot be empty!");
        }
        return OrderEntity.builder()
                .userAddress(request.getUserAddress())
                .amount(request.getAmount())
                .orderItems(request.getOrderItemList())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .orderStatus(request.getOrderStatus())
                .build();
    }

    private boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;

            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                    RAZORPAY_SECRET_KEY.getBytes(),
                    "HmacSHA256"
            );

            sha256Hmac.init(secretKey);

            byte[] hash = sha256Hmac.doFinal(payload.getBytes());

            String generatedSignature = bytesToHex(hash);

            System.out.println("Generated Signature: " + generatedSignature);
            System.out.println("Razorpay Signature: " + signature);

            return generatedSignature.equals(signature);

        } catch (Exception e) {
            throw new RuntimeException("Signature verification failed", e);
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}
