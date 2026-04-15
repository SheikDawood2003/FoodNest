package com.example.onlinefoodapplication.controller;

import com.example.onlinefoodapplication.io.CartRequest;
import com.example.onlinefoodapplication.io.CartResponse;
import com.example.onlinefoodapplication.service.CartService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api/cart")
@AllArgsConstructor
public class CartController {

    private final CartService cartService;
    @PostMapping
    public CartResponse addToCart(@RequestBody CartRequest request){
        String foodIdStr = request.getFoodId();

        if(foodIdStr == null || foodIdStr.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"FoodId Not Found");
        }

        Long foodId = Long.parseLong(foodIdStr); // ✅ FIX

        return cartService.addToCart(request);
    }

    @GetMapping
    public CartResponse getCart(){
        return cartService.getCart();
    }

    @DeleteMapping()
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart(){
        cartService.clearCart();
    }

    @DeleteMapping("/remove/{foodId}")
    public CartResponse removeItem(@PathVariable String foodId){
        return cartService.removeItemCompletely(foodId);
    }

    @PostMapping("/remove")
    public CartResponse removeFromCart(@RequestBody CartRequest request){
        String foodIdStr = request.getFoodId();

        if(foodIdStr == null || foodIdStr.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"FoodId Not Found");
        }

        return cartService.removeFromCart(request);
    }
}
