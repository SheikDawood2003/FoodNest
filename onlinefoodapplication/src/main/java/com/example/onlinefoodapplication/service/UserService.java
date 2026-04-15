package com.example.onlinefoodapplication.service;

import com.example.onlinefoodapplication.io.UserRequest;
import com.example.onlinefoodapplication.io.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRequest request);

    Long findByUserId();
}
