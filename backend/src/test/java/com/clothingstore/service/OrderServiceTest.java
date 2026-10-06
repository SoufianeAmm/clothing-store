package com.clothingstore.service;

import com.clothingstore.dto.OrderItemRequest;
import com.clothingstore.dto.OrderRequest;
import com.clothingstore.exception.InvalidOrderException;
import com.clothingstore.exception.ResourceNotFoundException;
import com.clothingstore.model.Order;
import com.clothingstore.model.Product;
import com.clothingstore.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductService productService;

    @InjectMocks
    private OrderService orderService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Classic Black T-Shirt");
        product.setPrice(new BigDecimal("19.99"));
        product.setStock(10);
        product.setAvailableSizes(List.of("S", "M", "L"));
        product.setAvailableColors(List.of("Black"));
    }

    private OrderRequest sampleRequest(String size, String color, int quantity) {
        OrderItemRequest item = new OrderItemRequest();
        item.setProductId(1L);
        item.setQuantity(quantity);
        item.setSelectedSize(size);
        item.setSelectedColor(color);

        OrderRequest request = new OrderRequest();
        request.setFirstName("Jane");
        request.setLastName("Doe");
        request.setEmail("jane@example.com");
        request.setPhone("555-1234");
        request.setAddress("123 Main St");
        request.setCity("Springfield");
        request.setCountry("USA");
        request.setItems(List.of(item));
        return request;
    }

    @Test
    void createOrder_computesTotalAndDecrementsStock_onValidRequest() {
        when(productService.getProductById(1L)).thenReturn(product);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        Order order = orderService.createOrder(sampleRequest("M", "Black", 2));

        assertThat(order.getTotalPrice()).isEqualByComparingTo("39.98");
        assertThat(order.getOrderNumber()).startsWith("ORD-");
        assertThat(order.getItems()).hasSize(1);
        verify(productService).decreaseStock(product, 2);
    }

    @Test
    void createOrder_throwsInvalidOrder_whenSizeNotAvailable() {
        when(productService.getProductById(1L)).thenReturn(product);

        assertThatThrownBy(() -> orderService.createOrder(sampleRequest("XXL", "Black", 1)))
                .isInstanceOf(InvalidOrderException.class);
    }

    @Test
    void createOrder_throwsInvalidOrder_whenColorNotAvailable() {
        when(productService.getProductById(1L)).thenReturn(product);

        assertThatThrownBy(() -> orderService.createOrder(sampleRequest("M", "Purple", 1)))
                .isInstanceOf(InvalidOrderException.class);
    }

    @Test
    void getOrderByNumber_throws_whenNotFound() {
        when(orderRepository.findByOrderNumber(eq("ORD-MISSING"))).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrderByNumber("ORD-MISSING"))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
