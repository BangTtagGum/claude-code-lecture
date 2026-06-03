package com.example.shop;

import java.util.Optional;

/**
 * Places orders: validates stock, persists the order, and charges the customer.
 * Depends on a repository, an inventory client, and a payment gateway — all injected.
 */
public class OrderService {

    private final OrderRepository orderRepository;
    private final InventoryClient inventoryClient;
    private final PaymentGateway paymentGateway;

    public OrderService(OrderRepository orderRepository,
                        InventoryClient inventoryClient,
                        PaymentGateway paymentGateway) {
        this.orderRepository = orderRepository;
        this.inventoryClient = inventoryClient;
        this.paymentGateway = paymentGateway;
    }

    /**
     * Places an order for the given customer.
     *
     * Behavior:
     *  - throws IllegalArgumentException if quantity <= 0
     *  - throws OutOfStockException if the inventory client reports insufficient stock
     *  - persists the order, then charges the customer for quantity * unitPrice
     *  - if the payment gateway throws, the order is marked FAILED and a PaymentException is raised
     *
     * @return the persisted order id
     */
    public Long placeOrder(Long customerId, String sku, int quantity, long unitPrice) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("quantity must be positive");
        }

        int available = inventoryClient.availableStock(sku);
        if (available < quantity) {
            throw new OutOfStockException(sku, quantity, available);
        }

        Order order = new Order(customerId, sku, quantity, unitPrice);
        Order saved = orderRepository.save(order);

        try {
            paymentGateway.charge(customerId, quantity * unitPrice);
        } catch (GatewayException e) {
            saved.markFailed();
            orderRepository.save(saved);
            throw new PaymentException("payment failed for order " + saved.getId(), e);
        }

        return saved.getId();
    }

    public Optional<Order> findOrder(Long id) {
        return orderRepository.findById(id);
    }
}
