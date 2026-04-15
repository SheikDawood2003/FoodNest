package com.example.onlinefoodapplication.repository;

import com.example.onlinefoodapplication.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {

    Optional<CartEntity> findByUserId(String userId);

    void deleteByUserId(String userId);
}
