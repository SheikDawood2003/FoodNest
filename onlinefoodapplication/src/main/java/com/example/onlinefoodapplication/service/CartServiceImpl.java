package com.example.onlinefoodapplication.service;


import com.example.onlinefoodapplication.entity.CartEntity;
import com.example.onlinefoodapplication.io.CartRequest;
import com.example.onlinefoodapplication.io.CartResponse;
import com.example.onlinefoodapplication.repository.CartRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService{

    private final CartRepository cartRepository;

    private final UserService userService;


    @Override
    public CartResponse addToCart(CartRequest request) {
        String loggedInUserId = String.valueOf(userService.findByUserId());
        Optional<CartEntity> cartOptional = cartRepository.findByUserId(loggedInUserId);
        CartEntity cart = cartOptional.orElseGet(() -> new CartEntity(loggedInUserId, new HashMap<>()));
        Map<String, Integer> cartItems = cart.getItems();
        String key = String.valueOf(request.getFoodId());
        cartItems.put(key, cartItems.getOrDefault(key, 0) + 1);
        cart.setItems(cartItems);
        cart = cartRepository.save(cart);
        return convertToResponse(cart);


    }

    @Override
    public CartResponse getCart() {
        String loggedInUserId = String.valueOf(userService.findByUserId());
        CartEntity entity = cartRepository.findByUserId(loggedInUserId)
                .orElse(new CartEntity(loggedInUserId, new HashMap<>()));

        return convertToResponse(entity);
    }

    @Override
    @Transactional
    public void clearCart() {
        String loggedInUserId = String.valueOf(userService.findByUserId());
        cartRepository.deleteByUserId(loggedInUserId);
    }

    @Override
    public CartResponse removeItemCompletely(String foodId) {
        String userId = String.valueOf(userService.findByUserId());

        CartEntity cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart Not Found"));

        cart.getItems().remove(foodId);

        cartRepository.save(cart);

        return convertToResponse(cart);
    }

    @Override
    public CartResponse removeFromCart(CartRequest request) {
        String loggedInUserId = String.valueOf(userService.findByUserId());
        CartEntity cartEntity = cartRepository.findByUserId(loggedInUserId). orElseThrow(() -> new RuntimeException("Cart Not Found"));
        Map<String, Integer> cartItem = cartEntity.getItems();
        if(cartItem.containsKey(request.getFoodId())){
            int curentQut = cartItem.get(request.getFoodId());
            if (curentQut <= 1) {
                cartItem.remove(request.getFoodId());
            } else {
                cartItem.put(request.getFoodId(), curentQut - 1);
            }
            cartEntity = cartRepository.save(cartEntity);

        }
        return convertToResponse(cartEntity);
    }

    private CartResponse convertToResponse(CartEntity cartEntity){
        return CartResponse.builder()
                .id(cartEntity.getId())
                .userId(cartEntity.getUserId())
                .items(cartEntity.getItems())
                .build();
    }
}
