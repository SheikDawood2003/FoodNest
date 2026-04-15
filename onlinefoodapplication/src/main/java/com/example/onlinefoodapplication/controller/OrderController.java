package com.example.onlinefoodapplication.controller;

import com.example.onlinefoodapplication.io.OrderRequest;
import com.example.onlinefoodapplication.io.OrderResponse;
import com.example.onlinefoodapplication.service.OrderService;
import com.razorpay.RazorpayException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;



    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrderWithPayment(@RequestBody OrderRequest request) throws RazorpayException {
        System.out.println(request);
        return orderService.createOrderWithPayment(request);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(@RequestBody Map<String, String> paymentData){
        orderService.verifyPayment(paymentData, "Paid");
        return ResponseEntity.ok("Payment Verified");
    }

    @GetMapping
    public List<OrderResponse> getOrders(){
        return orderService.getUserOrders();
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable long orderId){
        orderService.removeOrder(orderId);
    }

    @GetMapping("/all")
    public List<OrderResponse> getOrdersOfAllUsers(){
        return orderService.getOrdersOfAllUsers();
    }

    @PatchMapping("/status/{orderId}")
    public void updateOrderStatus(@PathVariable Long orderId, @RequestParam String status){
        System.out.println("Order ID: " + orderId);
        orderService.updateOrderStatus(orderId, status);
    }
}
