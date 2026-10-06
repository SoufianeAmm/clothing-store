package com.clothingstore.dto;

import com.clothingstore.model.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private String imageUrl;
    private Integer stock;
    private List<String> availableSizes;
    private List<String> availableColors;
    private LocalDateTime createdAt;

    public static ProductResponse fromEntity(Product product) {
        ProductResponse dto = new ProductResponse();
        dto.id = product.getId();
        dto.name = product.getName();
        dto.description = product.getDescription();
        dto.price = product.getPrice();
        dto.category = product.getCategory();
        dto.imageUrl = product.getImageUrl();
        dto.stock = product.getStock();
        dto.availableSizes = product.getAvailableSizes();
        dto.availableColors = product.getAvailableColors();
        dto.createdAt = product.getCreatedAt();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getCategory() {
        return category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Integer getStock() {
        return stock;
    }

    public List<String> getAvailableSizes() {
        return availableSizes;
    }

    public List<String> getAvailableColors() {
        return availableColors;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
