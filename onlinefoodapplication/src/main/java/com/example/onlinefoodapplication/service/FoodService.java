package com.example.onlinefoodapplication.service;

import com.example.onlinefoodapplication.io.FoodRequest;
import com.example.onlinefoodapplication.io.FoodResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodService {

    String uploadFile(MultipartFile file);
    FoodResponse addFood(FoodRequest request ,MultipartFile file);
    List<FoodResponse> readAllFood();
    FoodResponse readFood(Long id);
    boolean removeFile(String fileName);
    void deleteFood(Long id);
}
