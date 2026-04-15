package com.example.onlinefoodapplication.service;

import com.example.onlinefoodapplication.entity.FoodEntity;
import com.example.onlinefoodapplication.io.FoodRequest;
import com.example.onlinefoodapplication.io.FoodResponse;
import com.example.onlinefoodapplication.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FoodServiceImpl implements FoodService {

    @Autowired
    private S3Client s3Client;
    @Autowired
    private FoodRepository foodRepository;

    @Value("${aws.s3.bucket.name}")
    private String bucketName;

    @Override
    public String uploadFile(MultipartFile file) {
        if (file == null || file.getOriginalFilename() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid file");
        }
        String fileName = file.getOriginalFilename();
        String fileExtension = fileName.substring(fileName.lastIndexOf(".")+1);

        String key = UUID.randomUUID().toString()+"."+fileExtension;

        try{
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .acl("public-read")
                    .build();

            PutObjectResponse response = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            if(response.sdkHttpResponse().isSuccessful()){
                return "https://"+bucketName+".s3.amazonaws.com/"+key;
            }
            else{
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"File upload failed");
            }
        }catch (IOException e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"File upload failed"+e.getMessage());
        }
    }

    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile file) {
        FoodEntity entity = convertToEntity(request);
        String imageUrl = uploadFile(file);
        entity.setImageUrl(imageUrl);
        entity = foodRepository.save(entity);
        return convertToResponse(entity);
    }

    @Override
    public List<FoodResponse> readAllFood() {
        List<FoodEntity> foodEntities = foodRepository.findAll();
        return foodEntities.stream().map(object -> convertToResponse(object)).collect(Collectors.toList());
    }

    @Override
    public FoodResponse readFood(Long id) {
        FoodEntity foodEntity = foodRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Food not found"));
        return convertToResponse(foodEntity);
    }

    @Override
    public boolean removeFile(String fileName) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build();
        s3Client.deleteObject(deleteObjectRequest);
        return true;
    }

    @Override
    public void deleteFood(Long id) {
        FoodEntity foodEntity = foodRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Food not found"));
        String imageUrl = foodEntity.getImageUrl();
        String fileName = imageUrl.substring(imageUrl.lastIndexOf("/")+1);

        boolean removeFile = removeFile(fileName);

        if(removeFile){
            foodRepository.deleteById(id);
        }

    }

    private FoodEntity convertToEntity(FoodRequest request) {
        return FoodEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .build();
    }

    private FoodResponse convertToResponse(FoodEntity entity) {
        return FoodResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .category(entity.getCategory())
                .price(entity.getPrice())
                .imageUrl(entity.getImageUrl())
                .build();
    }
}
