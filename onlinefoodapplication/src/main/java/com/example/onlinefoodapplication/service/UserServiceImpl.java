package com.example.onlinefoodapplication.service;

import com.example.onlinefoodapplication.entity.UserEntity;
import com.example.onlinefoodapplication.io.UserRequest;
import com.example.onlinefoodapplication.io.UserResponse;
import com.example.onlinefoodapplication.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService{


    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private final AuthenticationFacade authenticationFacade;

    @Override
    public UserResponse registerUser(UserRequest request) {
        UserEntity newUser = convertToEntity(request);
        newUser = userRepository.save(newUser);
        return convertToResponse(newUser);
    }

    @Override
    public Long findByUserId() {
        String loggedUserEmail = authenticationFacade.getAuthentication().getName();
        UserEntity loggedInUser =  userRepository.findByEmail(loggedUserEmail).orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
        return loggedInUser.getId();
    }

    private UserEntity convertToEntity(UserRequest request){
        return UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode((request.getPassword())))
                .name(request.getName())
                .build();
    }

    private UserResponse convertToResponse(UserEntity registeredUser){
        return UserResponse.builder()
                .id(registeredUser.getId())
                .name(registeredUser.getName())
                .email(registeredUser.getEmail())
                .build();

    }
}
