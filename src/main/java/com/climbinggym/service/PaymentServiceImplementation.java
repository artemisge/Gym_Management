package com.climbinggym.service;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import com.climbinggym.entity.Payment;
import com.climbinggym.repository.PaymentRepository;

@Service
public class PaymentServiceImplementation implements PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentServiceImplementation(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Payment makePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public List<Payment> getPaymentsForUser(Integer userId) {
        return paymentRepository.findByUserId(userId);
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Sums all current payments to calculate total revenue 
    @Override
    public BigDecimal calculateTotalRevenue() {
        List<Payment> payments = paymentRepository.findAll();
        BigDecimal totalRevenue = BigDecimal.ZERO;  // Start with 0

        for (Payment payment : payments) {
            if (payment.getPackageType() != null && payment.getPackageType().getPrice() != null) {
                totalRevenue = totalRevenue.add(payment.getPackageType().getPrice());
            }
        }

        return totalRevenue;
    }
}
