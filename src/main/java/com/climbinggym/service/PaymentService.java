package com.climbinggym.service;

import com.climbinggym.entity.Payment;

import java.util.List;

public interface PaymentService {
    Payment makePayment(Payment payment);
    List<Payment> getPaymentsForUser(Long userId);
    List<Payment> getAllPayments();
}
