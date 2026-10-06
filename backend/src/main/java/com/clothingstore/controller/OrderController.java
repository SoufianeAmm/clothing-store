package com.clothingstore.controller;

import com.clothingstore.dto.OrderRequest;
import com.clothingstore.dto.OrderResponse;
import com.clothingstore.model.Order;
import com.clothingstore.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(OrderResponse.fromEntity(order));
    }

    @GetMapping("/{orderNumber}")
    public OrderResponse getOrder(@PathVariable String orderNumber) {
        return OrderResponse.fromEntity(orderService.getOrderByNumber(orderNumber));
    }
}
