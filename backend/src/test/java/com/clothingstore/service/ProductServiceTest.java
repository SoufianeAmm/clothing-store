package com.clothingstore.service;

import com.clothingstore.exception.InsufficientStockException;
import com.clothingstore.exception.ResourceNotFoundException;
import com.clothingstore.model.Product;
import com.clothingstore.repository.ProductRepository;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

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

    @Test
    void getProductById_returnsProduct_whenFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Product result = productService.getProductById(1L);

        assertThat(result.getName()).isEqualTo("Classic Black T-Shirt");
    }

    @Test
    void getProductById_throws_whenNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getProductById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void decreaseStock_reducesStockAndSaves_whenEnoughAvailable() {
        when(productRepository.save(any(Product.class))).thenReturn(product);

        productService.decreaseStock(product, 3);

        assertThat(product.getStock()).isEqualTo(7);
        verify(productRepository).save(product);
    }

    @Test
    void decreaseStock_throws_whenRequestExceedsStock() {
        assertThatThrownBy(() -> productService.decreaseStock(product, 11))
                .isInstanceOf(InsufficientStockException.class);

        // stock must be left untouched when the request is rejected
        assertThat(product.getStock()).isEqualTo(10);
    }
}
