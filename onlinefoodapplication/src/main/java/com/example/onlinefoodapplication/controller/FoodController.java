package com.example.onlinefoodapplication.controller;

import com.example.onlinefoodapplication.io.FoodRequest;
import com.example.onlinefoodapplication.io.FoodResponse;
import com.example.onlinefoodapplication.service.FoodService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FoodController {

    private FoodService foodService;

    @PostMapping
    public FoodResponse createFood(@RequestPart("food") String  foodString, @RequestPart("file") MultipartFile file){
        ObjectMapper objectMapper = new ObjectMapper();
        FoodRequest request = null;
        try{
            request = objectMapper.readValue((foodString), FoodRequest.class);
        }catch (JsonProcessingException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid JSON format");
        }
        FoodResponse response = foodService.addFood(request,file);
        return response;
    }

    @GetMapping
    public List<FoodResponse> readAllFoods(){
        return foodService.readAllFood();
    }

    @GetMapping("/{id}")
    public FoodResponse readFoodById(@PathVariable Long id){
        FoodResponse foodResponse = foodService.readFood(id);
        return foodResponse;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFoodById(@PathVariable Long id){
        foodService.deleteFood(id);
    }
}
