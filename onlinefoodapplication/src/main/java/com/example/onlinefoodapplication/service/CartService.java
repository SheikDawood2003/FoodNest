package com.example.onlinefoodapplication.service;

import com.example.onlinefoodapplication.io.CartRequest;
import com.example.onlinefoodapplication.io.CartResponse;

public interface CartService {

    CartResponse addToCart(CartRequest request);

    CartResponse getCart();

    void clearCart();
    CartResponse removeFromCart(CartRequest request);

    public CartResponse removeItemCompletely(String foodId);
}
