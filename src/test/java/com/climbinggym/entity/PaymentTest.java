package com.climbinggym.entity;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.Query;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import com.climbinggym.repository.PaymentRepository;
import com.climbinggym.repository.PackageRepository;
import com.climbinggym.repository.UserRepository;

import jakarta.transaction.Transactional;

@ActiveProfiles("test")
@SpringBootTest
@Transactional
public class PaymentTest {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PackageRepository packageRepository;

    @Test
    void testSaveAndRetrievePayment() {
        // Create and Save User
        User user = new User("Jane Doe", "jane.doe@example.com", "1234567890");
        userRepository.save(user);

        // Create and Save Package
        Package packageEntity = new Package("1 Month", BigDecimal.valueOf(50.00), 30, true);
        packageRepository.save(packageEntity);

        // Create and Save Payment
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPackageType(packageEntity);
        payment.setPaymentDate(LocalDate.now());
        paymentRepository.save(payment);

        // Retrieve Payment
        Payment retrievedPayment = paymentRepository.findById(payment.getId()).orElse(null);

        assertThat(retrievedPayment).isNotNull();
        assertThat(retrievedPayment.getUser()).isNotNull();
        assertThat(retrievedPayment.getUser().getName()).isEqualTo("Jane Doe");
        assertThat(retrievedPayment.getPackageType()).isNotNull();
        assertThat(retrievedPayment.getPackageType().getName()).isEqualTo("1 Month");
        assertThat(retrievedPayment.getPaymentDate()).isEqualTo(LocalDate.now());
    }

    @Test
    void testFindPaymentsByUserId() {
        // Create and Save User
        User user = new User("John Smith", "john.smith@example.com", "987654321");
        userRepository.save(user);

        // Create and Save Package
        Package packageEntity = new Package("Weekly", BigDecimal.valueOf(20.00), 7, true);
        packageRepository.save(packageEntity);

        // Create and Save Payment
        Payment payment1 = new Payment();
        payment1.setUser(user);
        payment1.setPackageType(packageEntity);
        payment1.setPaymentDate(LocalDate.now());
        paymentRepository.save(payment1);

        // Create another Payment for the same User
        Payment payment2 = new Payment();
        payment2.setUser(user);
        payment2.setPackageType(packageEntity);
        payment2.setPaymentDate(LocalDate.now().plusDays(7));
        paymentRepository.save(payment2);

        // Retrieve Payments by User ID
        List<Payment> payments = paymentRepository.findByUserId(user.getId());

        assertThat(payments).isNotEmpty();
        assertThat(payments).hasSize(2);
        assertThat(payments.get(0).getUser().getId()).isEqualTo(user.getId());
        assertThat(payments.get(1).getUser().getId()).isEqualTo(user.getId());
    }

    @Test
    void testUpdatePayment() {
        // Create and Save User
        User user = new User("Jane Doe", "jane.doe@example.com", "123456789");
        userRepository.save(user);

        // Create and Save Package
        Package initialPackage = new Package("Weekly", BigDecimal.valueOf(20.00), 7, true);
        packageRepository.save(initialPackage);

        Package newPackage = new Package("Monthly", BigDecimal.valueOf(70.00), 30, true);
        packageRepository.save(newPackage);

        // Create and Save Payment
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPackageType(initialPackage);
        payment.setPaymentDate(LocalDate.now());
        paymentRepository.save(payment);

        // Update Payment
        Payment retrievedPayment = paymentRepository.findById(payment.getId()).orElse(null);
        if (retrievedPayment != null) {
            retrievedPayment.setPackageType(newPackage);
            retrievedPayment.setPaymentDate(LocalDate.now().plusDays(5));
            paymentRepository.save(retrievedPayment);
        }

        // Verify Update
        Payment updatedPayment = paymentRepository.findById(payment.getId()).orElse(null);

        assertThat(updatedPayment).isNotNull();
        assertThat(updatedPayment.getPackageType().getName()).isEqualTo("Monthly");
        assertThat(updatedPayment.getPaymentDate()).isEqualTo(LocalDate.now().plusDays(5));
    }

    @Test
    void testDeletePayment() {
        // Create and Save User
        User user = new User("Alice", "alice@example.com", "1122334455");
        userRepository.save(user);

        // Create and Save Package
        Package packageEntity = new Package("Yearly", BigDecimal.valueOf(500.00), 365, true);
        packageRepository.save(packageEntity);

        // Create and Save Payment
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPackageType(packageEntity);
        payment.setPaymentDate(LocalDate.now());
        paymentRepository.save(payment);

        // Delete Payment
        paymentRepository.delete(payment);

        // Verify Deletion
        Payment deletedPayment = paymentRepository.findById(payment.getId()).orElse(null);
        assertThat(deletedPayment).isNull();
    }

    // @Transactional
    // @Test
    // void testCascadeDeleteUser() {
    //     // Create and Save User
    //     User user = new User("Cascade Test User", "cascade.user@example.com", "6677889900");
    //     userRepository.saveAndFlush(user);

    //     // Create and Save Package
    //     Package packageEntity = new Package("Cascade Test Package", BigDecimal.valueOf(100.00), 30, true);
    //     packageRepository.saveAndFlush(packageEntity);

    //     // Create and Save Payment
    //     Payment payment = new Payment();
    //     payment.setUser(user);
    //     payment.setPackageType(packageEntity);
    //     payment.setPaymentDate(LocalDate.now());
    //     paymentRepository.saveAndFlush(payment);

    //     // Verify initial state
    //     assertThat(userRepository.findAll()).hasSize(1);
    //     assertThat(paymentRepository.findAll()).hasSize(1);

    //     // Delete User
    //     userRepository.delete(user);
    //     userRepository.flush();

    //     // Verify cascade delete
    //     assertThat(userRepository.findAll()).isEmpty();
    //     assertThat(paymentRepository.findAll()).isEmpty();
    // }

    // @Test
    // void testCascadeDeleteUser2() throws InterruptedException {
    //     // Create and Save User
    //     User user = new User("Cascade Test User", "cascade.user@example.com", "6677889900");
    //     userRepository.save(user);

    //     User user2 = new User("Cascade Test User 2", "caascade.user@example.com", "66778891900");
    //     userRepository.save(user2);
    //     userRepository.delete(user2);
    //     System.out.println("USER2222222222222222222222222222222222222222");
    //     Optional<User> deletedUser = userRepository.findById(user2.getId());
    //     assertThat(deletedUser).isEmpty();

    //     // Create and Save Package
    //     Package packageEntity = new Package("Cascade Test Package", BigDecimal.valueOf(100.00), 30, true);
    //     packageRepository.save(packageEntity);

    //     // Create and Save Payment
    //     Payment payment = new Payment();
    //     payment.setUser(user);
    //     payment.setPackageType(packageEntity);
    //     payment.setPaymentDate(LocalDate.now());
    //     paymentRepository.save(payment);
    //     int uid = user2.getId();
    //     int pid = payment.getId();

    //     System.out.println("================ [1] =============");
    //     System.out.println(userRepository.findAll());
    //     System.out.println(userRepository.findById(uid));
    //     System.out.println(packageRepository.findAll());
    //     System.out.println(paymentRepository.findAll());
    //     System.out.println(paymentRepository.findById(pid));
    //     System.out.println("================ [2] =============");
    //     // Delete User and Verify Cascade
    //     userRepository.deleteAllInBatch(); // (user);
    //     userRepository.flush();
    //     packageRepository.flush();
    //     paymentRepository.flush();
    //     System.out.println(userRepository.findAll());
    //     System.out.println(userRepository.findById(uid));
    //     System.out.println(packageRepository.findAll());
    //     System.out.println(paymentRepository.findAll());
    //     System.out.println(paymentRepository.findById(pid));
    //     System.out.println("================ [3] =============");
    //     System.out.println(pid);
    //     // paymentRepository.delete(payment);//TREXEI ETSI. alla to cascade den douleuei
    //     Optional<Payment> deletedPayment = paymentRepository.findById(pid);
    //     // assertThat(deletedPayment).isEmpty();
    // }

    // @Transactional
    // @Test
    // void testCascadeDeletePackage() {
    //     // Create and Save User
    //     User user = new User("Cascade Test User 2", "cascade2.user@example.com", "2233445566");
    //     userRepository.save(user);

    //     // Create and Save Package
    //     Package packageEntity = new Package("Cascade Test Package 2", BigDecimal.valueOf(120.00), 60, true);
    //     packageRepository.save(packageEntity);

    //     // Create and Save Payment
    //     Payment payment = new Payment();
    //     payment.setUser(user);
    //     payment.setPackageType(packageEntity);
    //     payment.setPaymentDate(LocalDate.now());
    //     paymentRepository.save(payment);

    //     // Delete Package and Verify Cascade
    //     packageRepository.delete(packageEntity);

    //     Payment deletedPayment = paymentRepository.findById(payment.getId()).orElse(null);
    //     // assertThat(deletedPayment).isNull();
    // }
}
