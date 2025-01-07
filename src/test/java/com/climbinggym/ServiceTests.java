package com.climbinggym;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.mail.MessagingException;

import com.climbinggym.entity.*;
import com.climbinggym.entity.Package;
import com.climbinggym.repository.*;
import com.climbinggym.service.EmailService;
import com.climbinggym.service.PackageServiceImplementation;
import com.climbinggym.service.PaymentServiceImplementation;
import com.climbinggym.service.QRCodeService;
import com.climbinggym.service.UserServiceImplementation;

import jakarta.transaction.Transactional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.AutoClose;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

// @ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
@SpringBootTest
@Transactional
class ServiceTests {

    @MockitoBean
    private QRCodeService qrCodeService;

    @MockitoBean
    private EmailService emailService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private PackageRepository packageRepository;

    @Autowired
    private UserServiceImplementation userService;
    @Autowired
    private PaymentServiceImplementation paymentService;
    @Autowired
    private PackageServiceImplementation packageService;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        paymentRepository.deleteAll();
        packageRepository.deleteAll();
    }

    // Tests for UserServiceImplementation
    @Test
    void testAddUser() throws Exception {
        // Mock QR code service behavior
        when(qrCodeService.generateQRCodeForUser(anyInt(), anyString())).thenReturn("QR_CODE_PATH");

        // Mock email service behavior
        doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString(), anyString());

        User user = new User("John Doe", "john@example.com", "+123456789");

        User result = userService.addUser(user);
        int uid = result.getId();

        // Assert
        assertNotNull(result); // Check the user is returned
        assertEquals(uid, result.getId()); // Ensure ID is assigned
        assertEquals("John Doe", result.getName()); // Verify name matches

        // Verify QR code generation
        verify(qrCodeService, times(1)).generateQRCodeForUser(uid, "John Doe");

        // Verify email sending
        verify(emailService, times(1)).sendEmail(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    void testGetUser() {
        User user = new User("John Doe", "john@example.com", "+123456789");
        User addedUser = userService.addUser(user);
        int uid = addedUser.getId();

        User returnedUser = userService.getUser(uid);

        assertNotNull(returnedUser);
        assertEquals("John Doe", returnedUser.getName());
    }

    @Test
    void testUpdateMembership() {
        User user = new User("John Doe", "john@example.com", "+123456789");
        user.setExpirationDate(LocalDate.now());
        Package pkg = new Package("Monthly", BigDecimal.valueOf(100), 30, true);

        int uid = userService.addUser(user).getId();
        userService.updateMembership(uid, pkg);

        assertEquals(LocalDate.now().plusDays(30), user.getExpirationDate());
    }

    @Test
    void testIsMembershipActive() {
        User user = new User("John Doe", "john@example.com", "+123456789");
        user.setExpirationDate(LocalDate.now().plusDays(5));
        int uid = userService.addUser(user).getId();

        boolean isActive = userService.isMembershipActive(uid);

        assertTrue(isActive);
    }

    @Test
    void testDeleteUser() {
        User user = new User("John Doe", "john@example.com", "+123456789");
        int uid = userService.addUser(user).getId();
        userService.deleteUser(uid);

        // Assert that the user is no longer available (without causing exception)
        assertThrows(RuntimeException.class, () -> userService.getUser(uid), "User should be deleted and not found");
        verify(qrCodeService, times(1)).deleteQRCodeForUser(uid);
    }

    // Tests for PaymentServiceImplementation
    @Test
    void testMakePayment() {
        // Create User and Package for the test
        User user = new User("John Doe", "john@example.com", "+123456789");
        Package pkg = new Package("Monthly", BigDecimal.valueOf(100), 30, true);
        userService.addUser(user);
        packageService.addPackage(pkg);

        // Create Payment and associate with User and Package
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPackageType(pkg);
        payment.setPaymentDate(LocalDate.now());

        // Call the service method to make a payment
        Payment result = paymentService.makePayment(payment);

        // Assert that the payment is not null and the package price is correct
        assertNotNull(result);
        assertEquals(BigDecimal.valueOf(100), result.getPackageType().getPrice());
        assertEquals(user, result.getUser());
        assertEquals(pkg, result.getPackageType());
    }

    @Test
    void testGetPaymentsForUser() {
        // Create User and Package for the test
        User user = new User("John Doe", "john@example.com", "+123456789");
        Package pkg1 = new Package("Monthly", BigDecimal.valueOf(50), 30, true);
        Package pkg2 = new Package("Weekly", BigDecimal.valueOf(100), 7, true);

        userService.addUser(user);
        packageService.addPackage(pkg2);
        packageService.addPackage(pkg1);

        // Create Payments and associate with User and Package
        Payment payment1 = new Payment();
        payment1.setUser(user);
        payment1.setPackageType(pkg1);
        payment1.setPaymentDate(LocalDate.now());

        Payment payment2 = new Payment();
        payment2.setUser(user);
        payment2.setPackageType(pkg2);
        payment2.setPaymentDate(LocalDate.now());

        paymentService.makePayment(payment1);
        paymentService.makePayment(payment2);

        // Get payments for the user
        List<Payment> payments = paymentService.getPaymentsForUser(user.getId());

        // Assert the payments list size and prices
        assertEquals(2, payments.size());
        assertEquals(BigDecimal.valueOf(50),
                payments.get(0).getPackageType().getPrice());
        assertEquals(BigDecimal.valueOf(100),
                payments.get(1).getPackageType().getPrice());
    }

    @Test
    void testCalculateTotalRevenue() {
        // Create User and Package for the test
        User user1 = new User("John Doe", "john@example.com", "+123456789");
        User user2 = new User("Jane Doe", "jane@example.com", "+987654321");
        userService.addUser(user1);
        userService.addUser(user2);

        Package pkg1 = new Package("Monthly", BigDecimal.valueOf(50), 30, true);
        Package pkg2 = new Package("Weekly", BigDecimal.valueOf(20), 7, true);
        packageService.addPackage(pkg1);
        packageService.addPackage(pkg2);

        // Create Payments and associate with User and Package
        Payment payment1 = new Payment();
        payment1.setPackageType(pkg1);
        payment1.setUser(user1);
        payment1.setPaymentDate(LocalDate.now());

        Payment payment2 = new Payment();
        payment2.setPackageType(pkg2);
        payment2.setUser(user2);
        payment2.setPaymentDate(LocalDate.now());

        paymentService.makePayment(payment1);
        paymentService.makePayment(payment2);

        System.out.println("PAYMENTS" + paymentService.getAllPayments());
        // Calculate total revenue
        BigDecimal totalRevenue = paymentService.calculateTotalRevenue();

        // Assert the total revenue matches the expected value
        assertEquals(BigDecimal.valueOf(70), totalRevenue);
    }

    // Tests for PackageServiceImplementation
    @Test
    void testAddPackage() {
        Package pkg = new Package("Weekly", BigDecimal.valueOf(20), 7, true);

        Package result = packageService.addPackage(pkg);

        assertNotNull(result);
        assertEquals("Weekly", result.getName());
    }

    @Test
    void testGetAllPackages() {

        Package pkg1 = new Package("Weekly", BigDecimal.valueOf(20), 7, true);
        Package pkg2 = new Package("Monthly", BigDecimal.valueOf(50), 30, true);

        packageService.addPackage(pkg1);
        packageService.addPackage(pkg2);
        System.out.println("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        List<Package> packages = packageService.getAllPackages();
        System.out.println(packages);
        System.out.println("SIZE " + packages.size());

        assertEquals(2, packages.size());
        assertEquals("Weekly", packages.get(0).getName());
    }

    @Test
    void testGetPackageById() {
        Package pkg = new Package("Weekly", BigDecimal.valueOf(20), 7, true);
        int pid = packageService.addPackage(pkg).getId();

        Package result = packageService.getPackageById(pid);

        assertNotNull(result);
        assertEquals("Weekly", result.getName());
    }

    // @Test
    // void testCascadeDelete() {
    //     User user1 = new User("John Doe", "john@example.com", "+123456789");
    //     int uid = userService.addUser(user1).getId();

    //     Package pkg1 = new Package("Monthly", BigDecimal.valueOf(50), 30, true);
    //     int pid = packageService.addPackage(pkg1).getId();

    //     // Create Payments and associate with User and Package
    //     Payment payment1 = new Payment();
    //     payment1.setPackageType(pkg1);
    //     payment1.setUser(user1);
    //     payment1.setPaymentDate(LocalDate.now());
    //     paymentService.makePayment(payment1);

    //     userService.deleteUser(uid);
    //     System.out.println("HUIHUIHUIHUIHUIHUHIHIUHIUHIHIUHIU");
    //     System.out.println(paymentService.getAllPayments());
    // }
}
