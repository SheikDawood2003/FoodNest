package com.example.onlinefoodapplication.io;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@NoArgsConstructor  // <--- ADD THIS
@AllArgsConstructor // <--- ADD THIS (required when using @NoArgsConstructor + @Builder)
@Table(name = "order_item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long foodId;
    private int quantity;
    private Double price;
    private String category;
    private String imageUrl;
    private String description;
    private String name;
}
