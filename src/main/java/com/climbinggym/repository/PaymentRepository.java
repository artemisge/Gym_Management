package com.climbinggym.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.climbinggym.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    List<Payment> findByUserId(Integer userId);
}
