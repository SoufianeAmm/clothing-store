package com.clothingstore.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getAllProducts_returnsSeededCatalog() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(15));
    }

    @Test
    void getProductById_returns404_whenNotFound() throws Exception {
        mockMvc.perform(get("/api/products/99999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void getProductsByCategory_filtersCorrectly() throws Exception {
        mockMvc.perform(get("/api/products/category/Hoodies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].category").value("Hoodies"));
    }
}
