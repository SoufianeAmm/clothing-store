package com.clothingstore.seed;

import com.clothingstore.model.Product;
import com.clothingstore.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final List<String> STANDARD_SIZES = List.of("XS", "S", "M", "L", "XL");
    private static final List<String> SHOE_SIZES = List.of("39", "40", "41", "42", "43", "44");
    private static final List<String> ONE_SIZE = List.of("One Size");

    private final ProductRepository productRepository;

    public DataSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }

        productRepository.saveAll(List.of(
                product("Classic Black T-Shirt",
                        "A wardrobe essential cut from soft, breathable cotton. Fits true to size with a clean crew neck.",
                        "19.99", "T-Shirts", "https://picsum.photos/seed/classic-black-tshirt/600/800",
                        50, STANDARD_SIZES, List.of("Black")),

                product("Oversized White T-Shirt",
                        "Relaxed, oversized silhouette in heavyweight cotton for an effortless streetwear look.",
                        "24.99", "T-Shirts", "https://picsum.photos/seed/oversized-white-tshirt/600/800",
                        40, List.of("S", "M", "L", "XL"), List.of("White")),

                product("Beige Hoodie",
                        "Midweight fleece hoodie with a kangaroo pocket and ribbed cuffs for everyday layering.",
                        "49.99", "Hoodies", "https://picsum.photos/seed/beige-hoodie/600/800",
                        30, STANDARD_SIZES, List.of("Beige")),

                product("Black Hoodie",
                        "Our best-selling hoodie, brushed on the inside for extra warmth without the bulk.",
                        "49.99", "Hoodies", "https://picsum.photos/seed/black-hoodie/600/800",
                        35, STANDARD_SIZES, List.of("Black")),

                product("Blue Denim Jacket",
                        "Classic trucker-style jacket in mid-wash denim, built to soften and fade beautifully over time.",
                        "89.99", "Jackets", "https://picsum.photos/seed/blue-denim-jacket/600/800",
                        20, List.of("S", "M", "L", "XL"), List.of("Blue")),

                product("Black Cargo Pants",
                        "Utility-inspired cargo pants with multiple pockets and a tapered leg for a modern fit.",
                        "59.99", "Pants", "https://picsum.photos/seed/black-cargo-pants/600/800",
                        25, STANDARD_SIZES, List.of("Black")),

                product("Straight Jeans",
                        "Timeless straight-leg jeans in durable denim with a classic five-pocket design.",
                        "54.99", "Pants", "https://picsum.photos/seed/straight-jeans/600/800",
                        28, List.of("S", "M", "L", "XL"), List.of("Blue", "Black")),

                product("Athletic Shorts",
                        "Lightweight, quick-dry shorts with an elastic waistband, built for training or lounging.",
                        "29.99", "Shorts", "https://picsum.photos/seed/athletic-shorts/600/800",
                        45, STANDARD_SIZES, List.of("Black", "Navy")),

                product("Oversized Sweatshirt",
                        "Drop-shoulder sweatshirt in a heavyweight cotton blend for a relaxed, modern fit.",
                        "44.99", "Sweatshirts", "https://picsum.photos/seed/oversized-sweatshirt/600/800",
                        32, List.of("S", "M", "L", "XL"), List.of("Grey", "Black")),

                product("Basic Polo",
                        "A clean, tailored polo in piqué cotton that moves easily from casual to smart-casual.",
                        "34.99", "Polos", "https://picsum.photos/seed/basic-polo/600/800",
                        38, STANDARD_SIZES, List.of("White", "Navy", "Black")),

                product("Bomber Jacket",
                        "Classic bomber silhouette with ribbed collar and cuffs, finished with a sturdy front zip.",
                        "94.99", "Jackets", "https://picsum.photos/seed/bomber-jacket/600/800",
                        18, List.of("S", "M", "L", "XL"), List.of("Olive", "Black")),

                product("White Sneakers",
                        "Minimalist low-top sneakers in smooth leather with a cushioned sole for all-day comfort.",
                        "79.99", "Footwear", "https://picsum.photos/seed/white-sneakers/600/800",
                        24, SHOE_SIZES, List.of("White")),

                product("Black Cap",
                        "Structured six-panel cap with an adjustable strap and embroidered eyelets.",
                        "19.99", "Accessories", "https://picsum.photos/seed/black-cap/600/800",
                        60, ONE_SIZE, List.of("Black")),

                product("Knit Sweater",
                        "Fine-gauge knit sweater with a crew neck, soft against the skin and warm without bulk.",
                        "54.99", "Sweaters", "https://picsum.photos/seed/knit-sweater/600/800",
                        22, STANDARD_SIZES, List.of("Grey", "Navy")),

                product("Summer Shirt",
                        "Breathable short-sleeve shirt in a lightweight weave, perfect for warm-weather days.",
                        "39.99", "Shirts", "https://picsum.photos/seed/summer-shirt/600/800",
                        33, STANDARD_SIZES, List.of("White", "Blue"))
        ));
    }

    private Product product(String name, String description, String price, String category, String imageUrl,
                              int stock, List<String> sizes, List<String> colors) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(new BigDecimal(price));
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        product.setStock(stock);
        product.setAvailableSizes(sizes);
        product.setAvailableColors(colors);
        return product;
    }
}
