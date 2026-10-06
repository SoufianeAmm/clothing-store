package com.clothingstore.controller;

import com.clothingstore.dto.ProductRequest;
import com.clothingstore.dto.ProductResponse;
import com.clothingstore.model.Product;
import com.clothingstore.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts().stream().map(ProductResponse::fromEntity).toList();
    }

    @GetMapping("/{id}")
    public ProductResponse getProductById(@PathVariable Long id) {
        return ProductResponse.fromEntity(productService.getProductById(id));
    }

    @GetMapping("/category/{category}")
    public List<ProductResponse> getProductsByCategory(@PathVariable String category) {
        return productService.getProductsByCategory(category).stream().map(ProductResponse::fromEntity).toList();
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        Product created = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ProductResponse.fromEntity(created));
    }

    @PutMapping("/{id}")
    public ProductResponse updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ProductResponse.fromEntity(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
