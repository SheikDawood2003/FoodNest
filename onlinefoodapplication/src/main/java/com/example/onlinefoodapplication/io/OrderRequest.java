package com.example.onlinefoodapplication.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {

    private List<OrderItem> orderItemList;
    private String userAddress;
    private Double amount;
    private String email;
    private String phoneNumber;
    private String orderStatus;
}
