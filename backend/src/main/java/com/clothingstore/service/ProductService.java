package com.clothingstore.service;

import com.clothingstore.dto.ProductRequest;
import com.clothingstore.exception.InsufficientStockException;
import com.clothingstore.exception.ResourceNotFoundException;
import com.clothingstore.model.Product;
import com.clothingstore.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    public Product createProduct(ProductRequest request) {
        Product product = new Product();
        applyRequest(product, request);
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);
        applyRequest(product, request);
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public void decreaseStock(Product product, int quantity) {
        if (product.getStock() < quantity) {
            throw new InsufficientStockException(
                    "Insufficient stock for product '" + product.getName() + "': requested " + quantity
                            + ", available " + product.getStock());
        }
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
    }

    private void applyRequest(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setStock(request.getStock());
        product.setAvailableSizes(request.getAvailableSizes());
        product.setAvailableColors(request.getAvailableColors());
    }
}
