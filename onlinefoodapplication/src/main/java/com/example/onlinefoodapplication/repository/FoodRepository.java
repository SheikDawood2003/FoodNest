package com.example.onlinefoodapplication.repository;

import com.example.onlinefoodapplication.entity.FoodEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodRepository extends JpaRepository<FoodEntity,Long> {
}
