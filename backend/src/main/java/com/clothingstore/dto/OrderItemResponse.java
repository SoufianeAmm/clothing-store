package com.clothingstore.dto;

import com.clothingstore.model.OrderItem;

import java.math.BigDecimal;

public class OrderItemResponse {
    private Long productId;
    private String productName;
    private String imageUrl;
    private Integer quantity;
    private BigDecimal price;
    private String selectedSize;
    private String selectedColor;
    private BigDecimal lineTotal;

    public static OrderItemResponse fromEntity(OrderItem item) {
        OrderItemResponse dto = new OrderItemResponse();
        dto.productId = item.getProduct().getId();
        dto.productName = item.getProduct().getName();
        dto.imageUrl = item.getProduct().getImageUrl();
        dto.quantity = item.getQuantity();
        dto.price = item.getPrice();
        dto.selectedSize = item.getSelectedSize();
        dto.selectedColor = item.getSelectedColor();
        dto.lineTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return dto;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getSelectedSize() {
        return selectedSize;
    }

    public String getSelectedColor() {
        return selectedColor;
    }

    public BigDecimal getLineTotal() {
        return lineTotal;
    }
}
