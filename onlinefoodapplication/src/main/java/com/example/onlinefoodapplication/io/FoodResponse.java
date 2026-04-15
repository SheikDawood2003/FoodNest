package com.example.onlinefoodapplication.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FoodResponse {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private String imageUrl;
}
