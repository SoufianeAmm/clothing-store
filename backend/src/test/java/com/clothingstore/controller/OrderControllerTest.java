package com.clothingstore.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // product id 1 is "Classic Black T-Shirt" from DataSeeder: $19.99, sizes XS-XL, color Black, stock 50
    private Map<String, Object> baseOrder(Map<String, Object> item) {
        return Map.of(
                "firstName", "Jane",
                "lastName", "Doe",
                "email", "jane@example.com",
                "phone", "555-1234",
                "address", "123 Main St",
                "city", "Springfield",
                "country", "USA",
                "items", java.util.List.of(item));
    }

    @Test
    void createOrder_returns201_onValidRequest() throws Exception {
        Map<String, Object> item = Map.of("productId", 1, "quantity", 2, "selectedSize", "M", "selectedColor", "Black");

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(baseOrder(item))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderNumber").value(org.hamcrest.Matchers.startsWith("ORD-")))
                .andExpect(jsonPath("$.totalPrice").value(39.98))
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    void createOrder_returns409_whenStockInsufficient() throws Exception {
        Map<String, Object> item = Map.of("productId", 1, "quantity", 999999, "selectedSize", "M", "selectedColor", "Black");

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(baseOrder(item))))
                .andExpect(status().isConflict());
    }

    @Test
    void createOrder_returns400_whenRequiredFieldMissing() throws Exception {
        Map<String, Object> item = Map.of("productId", 1, "quantity", 1, "selectedSize", "M", "selectedColor", "Black");
        Map<String, Object> invalid = new java.util.HashMap<>(baseOrder(item));
        invalid.put("email", "");

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details").isArray());
    }
}
