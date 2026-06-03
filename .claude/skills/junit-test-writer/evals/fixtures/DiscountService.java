package com.example.shop;

import java.math.BigDecimal;

/**
 * Calculates the final price after applying a membership discount and an optional coupon.
 * Pure business logic with branching and boundary conditions — no external dependencies.
 */
public class DiscountService {

    private static final BigDecimal VIP_THRESHOLD = new BigDecimal("100000");

    /**
     * @param basePrice    the price before any discount; must be >= 0
     * @param membership   one of "VIP", "REGULAR", or null for a guest
     * @param couponAmount a flat coupon amount to subtract after the membership discount; may be null
     * @return the final price, never below zero
     * @throws IllegalArgumentException if basePrice is negative
     */
    public BigDecimal finalPrice(BigDecimal basePrice, String membership, BigDecimal couponAmount) {
        if (basePrice == null || basePrice.signum() < 0) {
            throw new IllegalArgumentException("basePrice must be non-negative");
        }

        BigDecimal price = basePrice;

        if ("VIP".equals(membership)) {
            // VIP gets 20%, or 25% when the base price reaches the VIP threshold.
            BigDecimal rate = basePrice.compareTo(VIP_THRESHOLD) >= 0
                    ? new BigDecimal("0.25")
                    : new BigDecimal("0.20");
            price = price.subtract(price.multiply(rate));
        } else if ("REGULAR".equals(membership)) {
            price = price.subtract(price.multiply(new BigDecimal("0.10")));
        }
        // guests (null/unknown membership) get no membership discount

        if (couponAmount != null) {
            price = price.subtract(couponAmount);
        }

        return price.signum() < 0 ? BigDecimal.ZERO : price;
    }
}
