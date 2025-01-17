package com.climbinggym.controller;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.climbinggym.entity.Payment;
import com.climbinggym.service.PaymentService;

@CrossOrigin
@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<Payment> makePayment(@RequestBody Payment payment) {
        Payment createdPayment = paymentService.makePayment(payment);
        return ResponseEntity.ok(createdPayment);
    }

    // Returns all payments associated with a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getPaymentsForUser(@PathVariable Integer userId) {
        List<Payment> payments = paymentService.getPaymentsForUser(userId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/revenue")
    public ResponseEntity<BigDecimal> getTotalRevenue() {
        BigDecimal totalRevenue = paymentService.calculateTotalRevenue();
        return ResponseEntity.ok(totalRevenue);
    }
}
