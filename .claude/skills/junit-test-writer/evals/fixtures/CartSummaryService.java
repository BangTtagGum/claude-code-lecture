package com.example.shop;

import java.util.List;

/**
 * Summarizes a shopping cart: total, item count, and whether free shipping applies.
 * Pure logic over a collection — exercises empty / single / many and a boundary.
 */
public class CartSummaryService {

    private static final long FREE_SHIPPING_THRESHOLD = 50000L;

    public CartSummary summarize(List<CartLine> lines) {
        if (lines == null) {
            throw new IllegalArgumentException("lines must not be null");
        }

        long total = 0;
        int itemCount = 0;
        for (CartLine line : lines) {
            if (line.quantity() < 0) {
                throw new IllegalArgumentException("quantity must not be negative");
            }
            total += line.unitPrice() * line.quantity();
            itemCount += line.quantity();
        }

        boolean freeShipping = total >= FREE_SHIPPING_THRESHOLD;
        return new CartSummary(total, itemCount, freeShipping);
    }

    public record CartLine(String sku, long unitPrice, int quantity) {}

    public record CartSummary(long total, int itemCount, boolean freeShipping) {}
}
