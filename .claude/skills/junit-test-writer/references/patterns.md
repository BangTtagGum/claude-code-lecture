# JUnit 5 + Mockito + AssertJ patterns

Copy-paste-ready starting points. Adapt names, imports, and fixtures to the actual project — these show
the shape, not the literal answer.

## Contents
- [Service test skeleton (@Mock / @InjectMocks)](#service-test-skeleton)
- [Stubbing and interaction verification](#stubbing-and-verification)
- [Exception assertions](#exception-assertions)
- [Parameterized boundary tests](#parameterized-tests)
- [Grouping with @Nested](#nested-grouping)

## Service test skeleton

The standard setup for a service whose dependencies are injected via constructor. `@ExtendWith` wires
Mockito; `@InjectMocks` constructs the service with the mocks.

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private PaymentGateway paymentGateway;

    @InjectMocks
    private OrderService orderService;

    @Test
    @DisplayName("placeOrder saves the order and returns its id")
    void placeOrder_savesAndReturnsId() {
        // given
        Order order = new Order("item-1", 2);
        given(orderRepository.save(any(Order.class)))
                .willReturn(order.withId(42L));

        // when
        Long id = orderService.placeOrder(order);

        // then
        assertThat(id).isEqualTo(42L);
    }
}
```

## Stubbing and verification

Stub only what the test exercises. When the method's job includes *calling* a dependency, verify the call
— the return value alone doesn't prove the side effect happened correctly.

```java
@Test
@DisplayName("placeOrder charges the customer exactly once with the order total")
void placeOrder_chargesCustomer() {
    // given
    Order order = new Order("item-1", 2);          // total = 20
    given(orderRepository.save(any())).willReturn(order.withId(1L));

    // when
    orderService.placeOrder(order);

    // then
    ArgumentCaptor<Money> amount = ArgumentCaptor.forClass(Money.class);
    verify(paymentGateway).charge(eq(order.getCustomerId()), amount.capture());
    assertThat(amount.getValue()).isEqualTo(Money.of(20));
    verifyNoMoreInteractions(paymentGateway);
}
```

Tip: `verify(mock, never()).method()` is the right way to assert something *didn't* happen — e.g. a
rejected order must never be charged.

## Exception assertions

Use AssertJ's exception assertions so you can pin down the type *and* the message, which is usually part
of the contract.

```java
@Test
@DisplayName("placeOrder rejects a null order with a clear message")
void placeOrder_nullOrder_throws() {
    assertThatThrownBy(() -> orderService.placeOrder(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("order");
}

@Test
@DisplayName("placeOrder wraps a gateway failure as PaymentException")
void placeOrder_gatewayFails_wrapsException() {
    given(orderRepository.save(any())).willReturn(new Order().withId(1L));
    willThrow(new SocketTimeoutException())
            .given(paymentGateway).charge(any(), any());

    assertThatExceptionOfType(PaymentException.class)
            .isThrownBy(() -> orderService.placeOrder(new Order("i", 1)))
            .withCauseInstanceOf(SocketTimeoutException.class);
}
```

## Parameterized tests

When one behavior holds across several inputs, a parameterized test says "this is true for all of these"
far more clearly than copy-pasted methods. Ideal for boundary sweeps and families of invalid input.

```java
@ParameterizedTest(name = "quantity {0} is rejected")
@ValueSource(ints = {0, -1, -100})
@DisplayName("placeOrder rejects non-positive quantities")
void placeOrder_nonPositiveQuantity_throws(int quantity) {
    assertThatThrownBy(() -> orderService.placeOrder(new Order("item", quantity)))
            .isInstanceOf(IllegalArgumentException.class);
}

// Boundary sweep with expected results paired to inputs:
@ParameterizedTest
@CsvSource({
        "99,  false",   // just below threshold
        "100, true",    // exactly on threshold
        "101, true"     // just above
})
void qualifiesForFreeShipping_atThreshold(int total, boolean expected) {
    assertThat(orderService.qualifiesForFreeShipping(total)).isEqualTo(expected);
}
```

## Nested grouping

For a method (or class) with several distinct scenarios, `@Nested` keeps a thorough suite readable by
grouping tests under the behavior they explore.

```java
@Nested
@DisplayName("when the cart is empty")
class EmptyCart {

    @BeforeEach
    void emptyCart() {
        given(cartRepository.findItems(anyLong())).willReturn(List.of());
    }

    @Test
    void checkout_returnsZeroTotal() {
        assertThat(orderService.checkout(1L).total()).isEqualTo(Money.ZERO);
    }

    @Test
    void checkout_doesNotChargeCustomer() {
        orderService.checkout(1L);
        verify(paymentGateway, never()).charge(any(), any());
    }
}
```

## Common imports

```java
import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.*;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
```
