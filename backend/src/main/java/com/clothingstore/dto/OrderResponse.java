package com.clothingstore.dto;

import com.clothingstore.model.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {
    private Long id;
    private String orderNumber;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String country;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;

    public static OrderResponse fromEntity(Order order) {
        OrderResponse dto = new OrderResponse();
        dto.id = order.getId();
        dto.orderNumber = order.getOrderNumber();
        dto.firstName = order.getFirstName();
        dto.lastName = order.getLastName();
        dto.email = order.getEmail();
        dto.phone = order.getPhone();
        dto.address = order.getAddress();
        dto.city = order.getCity();
        dto.country = order.getCountry();
        dto.totalPrice = order.getTotalPrice();
        dto.status = order.getStatus().name();
        dto.createdAt = order.getCreatedAt();
        dto.items = order.getItems().stream().map(OrderItemResponse::fromEntity).toList();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getCountry() {
        return country;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }
}
