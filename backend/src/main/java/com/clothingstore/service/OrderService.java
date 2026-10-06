package com.clothingstore.service;

import com.clothingstore.dto.OrderItemRequest;
import com.clothingstore.dto.OrderRequest;
import com.clothingstore.exception.InvalidOrderException;
import com.clothingstore.exception.ResourceNotFoundException;
import com.clothingstore.model.Order;
import com.clothingstore.model.OrderItem;
import com.clothingstore.model.Product;
import com.clothingstore.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;

    public OrderService(OrderRepository orderRepository, ProductService productService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
    }

    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setFirstName(request.getFirstName());
        order.setLastName(request.getLastName());
        order.setEmail(request.getEmail());
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress());
        order.setCity(request.getCity());
        order.setCountry(request.getCountry());

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productService.getProductById(itemRequest.getProductId());
            validateSizeAndColor(product, itemRequest);

            // reserve stock before building the line item so a shortage aborts the whole order
            productService.decreaseStock(product, itemRequest.getQuantity());

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(product.getPrice());
            item.setSelectedSize(itemRequest.getSelectedSize());
            item.setSelectedColor(itemRequest.getSelectedColor());
            order.addItem(item);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
        }

        order.setTotalPrice(total);
        return orderRepository.save(order);
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));
    }

    private void validateSizeAndColor(Product product, OrderItemRequest itemRequest) {
        boolean validSize = product.getAvailableSizes().stream()
                .anyMatch(s -> s.equalsIgnoreCase(itemRequest.getSelectedSize()));
        boolean validColor = product.getAvailableColors().stream()
                .anyMatch(c -> c.equalsIgnoreCase(itemRequest.getSelectedColor()));

        if (!validSize) {
            throw new InvalidOrderException(
                    "Size '" + itemRequest.getSelectedSize() + "' is not available for " + product.getName());
        }
        if (!validColor) {
            throw new InvalidOrderException(
                    "Color '" + itemRequest.getSelectedColor() + "' is not available for " + product.getName());
        }
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
