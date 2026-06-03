// Supporting types for OrderService — provided so generated tests have a realistic surface to compile against.
package com.example.shop;

import java.util.Optional;

interface OrderRepository {
    Order save(Order order);
    Optional<Order> findById(Long id);
}

interface InventoryClient {
    int availableStock(String sku);
}

interface PaymentGateway {
    void charge(Long customerId, long amount) throws GatewayException;
}

class Order {
    private Long id;
    private final Long customerId;
    private final String sku;
    private final int quantity;
    private final long unitPrice;
    private String status = "NEW";

    Order(Long customerId, String sku, int quantity, long unitPrice) {
        this.customerId = customerId;
        this.sku = sku;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    Long getId() { return id; }
    void setId(Long id) { this.id = id; }
    Long getCustomerId() { return customerId; }
    int getQuantity() { return quantity; }
    long getUnitPrice() { return unitPrice; }
    String getStatus() { return status; }
    void markFailed() { this.status = "FAILED"; }
}

class OutOfStockException extends RuntimeException {
    OutOfStockException(String sku, int requested, int available) {
        super("out of stock for " + sku + ": requested " + requested + ", available " + available);
    }
}

class GatewayException extends Exception {
    GatewayException(String message) { super(message); }
}

class PaymentException extends RuntimeException {
    PaymentException(String message, Throwable cause) { super(message, cause); }
}
