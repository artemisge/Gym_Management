// package com.climbinggym;

// import static org.mockito.Mockito.*;
// import static org.junit.jupiter.api.Assertions.*;

// import java.math.BigDecimal;
// import java.time.LocalDate;
// import java.util.Arrays;
// import java.util.List;
// import java.util.Optional;

// import javax.mail.MessagingException;

// import com.climbinggym.entity.*;
// import com.climbinggym.entity.Package;
// import com.climbinggym.repository.*;
// import com.climbinggym.service.EmailService;
// import com.climbinggym.service.PackageServiceImplementation;
// import com.climbinggym.service.PaymentServiceImplementation;
// import com.climbinggym.service.QRCodeService;
// import com.climbinggym.service.UserServiceImplementation;

// import org.junit.jupiter.api.AfterEach;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import org.mockito.junit.jupiter.MockitoExtension;
// import org.springframework.boot.context.properties.EnableConfigurationProperties;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.test.context.ActiveProfiles;
// import org.springframework.test.context.TestPropertySource;

// @ExtendWith(MockitoExtension.class)
// class ServiceTests {

//     @Mock
//     private UserRepository userRepository;

//     @Mock
//     private QRCodeService qrCodeService;

//     @Mock
//     private EmailService emailService;

//     // @Mock
//     // private PaymentRepository paymentRepository;

//     // @Mock
//     // private PackageRepository packageRepository;

//     @InjectMocks
//     private UserServiceImplementation userService;

//     // @InjectMocks
//     // private PaymentServiceImplementation paymentService;

//     // @InjectMocks
//     // private PackageServiceImplementation packageService;

//     @BeforeEach
//     void setUp() {
//         System.out.println("HIHIHIHIHI");
//         assertNotNull(userRepository); // Ensures the mock is not null
//         assertNotNull(qrCodeService); // Ensures the mock is not null
//         assertNotNull(emailService); // Ensures the mock is not null
//         // MockitoAnnotations.openMocks(this);
//     }

//     @AfterEach
//     void cleanUp() {
//         userRepository.deleteAll();
//         // paymentRepository.deleteAll();
//         // packageRepository.deleteAll();
//     }

//     // Tests for UserServiceImplementation
//     @Test
//     void testAddUser() throws Exception {
//         System.out.println("lalalallalalal");
//         // Arrange
//         User user = new User("John Doe", "john@example.com", "+123456789");
//         user.setId(1);

//         // Mock userRepository.save to assign an ID
//         when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
//             User savedUser = invocation.getArgument(0); // Get the argument passed to save()
//             savedUser.setId(1); // Simulate setting an ID (e.g., 1)
//             return savedUser; // Return the saved user with ID
//         });
//         when(qrCodeService.generateQRCodeForUser(anyInt(), anyString())).thenReturn("qrcodepath");

//         // Act
//         User result = userService.addUser(user);

//         // Assert
//         assertNotNull(result); // Check the user is returned
//         assertEquals(1, result.getId()); // Ensure ID is assigned
//         assertEquals("John Doe", result.getName()); // Verify name matches

//         // Verify QR code generation
//         verify(qrCodeService, times(1)).generateQRCodeForUser(1, "John Doe");

//         // Verify email sending
//         verify(emailService, times(1)).sendEmail(anyString(), anyString(), anyString(), anyString());
//     }

//     // @Test
//     // void testGetUser() {
//     // User user = new User("John Doe", "john@example.com", "+123456789");
//     // when(userRepository.findById(1)).thenReturn(Optional.of(user));

//     // User result = userService.getUser(1);

//     // assertNotNull(result);
//     // assertEquals("John Doe", result.getName());
//     // }

//     // @Test
//     // void testUpdateMembership() {
//     // User user = new User("John Doe", "john@example.com", "+123456789");
//     // user.setExpirationDate(LocalDate.now());
//     // Package pkg = new Package("Monthly", BigDecimal.valueOf(100), 30, true);

//     // when(userRepository.findById(1)).thenReturn(Optional.of(user));
//     // when(userRepository.save(any(User.class))).thenReturn(user);

//     // userService.updateMembership(1, pkg);

//     // assertEquals(LocalDate.now().plusDays(30), user.getExpirationDate());
//     // verify(userRepository, times(1)).save(user);
//     // }

//     // @Test
//     // void testIsMembershipActive() {
//     // User user = new User("John Doe", "john@example.com", "+123456789");
//     // user.setExpirationDate(LocalDate.now().plusDays(5));
//     // when(userRepository.findById(1)).thenReturn(Optional.of(user));

//     // boolean isActive = userService.isMembershipActive(1);

//     // assertTrue(isActive);
//     // }

//     // @Test
//     // void testDeleteUser() {
//     // doNothing().when(userRepository).deleteById(1);
//     // doNothing().when(qrCodeService).deleteQRCodeForUser(1);

//     // userService.deleteUser(1);

//     // verify(userRepository, times(1)).deleteById(1);
//     // verify(qrCodeService, times(1)).deleteQRCodeForUser(1);
//     // }

//     // // Tests for PaymentServiceImplementation
//     // @Test
//     // void testMakePayment() {
//     // // Create User and Package for the test
//     // User user = new User("John Doe", "john@example.com", "+123456789");
//     // Package pkg = new Package("Monthly", BigDecimal.valueOf(100), 30, true);

//     // // Create Payment and associate with User and Package
//     // Payment payment = new Payment();
//     // payment.setUser(user);
//     // payment.setPackageType(pkg);
//     // payment.setPaymentDate(LocalDate.now());

//     // // Mock the repository save method to return the created payment
//     // when(paymentRepository.save(payment)).thenReturn(payment);

//     // // Call the service method to make a payment
//     // Payment result = paymentService.makePayment(payment);

//     // // Assert that the payment is not null and the package price is correct
//     // assertNotNull(result);
//     // assertEquals(BigDecimal.valueOf(100), result.getPackageType().getPrice());
//     // assertEquals(user, result.getUser());
//     // assertEquals(pkg, result.getPackageType());
//     // }

//     // @Test
//     // void testGetPaymentsForUser() {
//     // // Create User and Package for the test
//     // User user = new User("John Doe", "john@example.com", "+123456789");
//     // Package pkg1 = new Package("Monthly", BigDecimal.valueOf(50), 30, true);
//     // Package pkg2 = new Package("Weekly", BigDecimal.valueOf(100), 7, true);

//     // // Create Payments and associate with User and Package
//     // Payment payment1 = new Payment();
//     // payment1.setUser(user);
//     // payment1.setPackageType(pkg1);
//     // payment1.setPaymentDate(LocalDate.now());

//     // Payment payment2 = new Payment();
//     // payment2.setUser(user);
//     // payment2.setPackageType(pkg2);
//     // payment2.setPaymentDate(LocalDate.now());

//     // // Mock the repository call
//     // when(paymentRepository.findByUserId(1)).thenReturn(Arrays.asList(payment1,
//     // payment2));

//     // // Get payments for the user
//     // List<Payment> payments = paymentService.getPaymentsForUser(1);

//     // // Assert the payments list size and prices
//     // assertEquals(2, payments.size());
//     // assertEquals(BigDecimal.valueOf(50),
//     // payments.get(0).getPackageType().getPrice());
//     // assertEquals(BigDecimal.valueOf(100),
//     // payments.get(1).getPackageType().getPrice());
//     // }

//     // @Test
//     // void testCalculateTotalRevenue() {
//     // // Create User and Package for the test
//     // User user1 = new User("John Doe", "john@example.com", "+123456789");
//     // User user2 = new User("Jane Doe", "jane@example.com", "+987654321");

//     // Package pkg1 = new Package("Monthly", BigDecimal.valueOf(50), 30, true);
//     // Package pkg2 = new Package("Weekly", BigDecimal.valueOf(20), 7, true);

//     // // Create Payments and associate with User and Package
//     // Payment payment1 = new Payment();
//     // payment1.setPackageType(pkg1);
//     // payment1.setUser(user1);
//     // payment1.setPaymentDate(LocalDate.now());

//     // Payment payment2 = new Payment();
//     // payment2.setPackageType(pkg2);
//     // payment2.setUser(user2);
//     // payment2.setPaymentDate(LocalDate.now());
//     // System.out.println("TESTTT");
//     // // Mock the repository calls
//     // when(paymentRepository.findAll()).thenReturn(Arrays.asList(payment1,
//     // payment2));

//     // System.out.println("PAYMENTS"+paymentService.getAllPayments());
//     // // Calculate total revenue
//     // BigDecimal totalRevenue = paymentService.calculateTotalRevenue();

//     // // Assert the total revenue matches the expected value
//     // assertEquals(BigDecimal.valueOf(70), totalRevenue);
//     // }

//     // // Tests for PackageServiceImplementation
//     // @Test
//     // void testAddPackage() {
//     // Package pkg = new Package("Weekly", BigDecimal.valueOf(20), 7, true);
//     // when(packageRepository.save(pkg)).thenReturn(pkg);

//     // Package result = packageService.addPackage(pkg);
//     // System.out.println(result);
//     // assertNotNull(result);
//     // assertEquals("Weekly", result.getName());
//     // }

//     // @Test
//     // void testGetAllPackages() {
//     // Package pkg1 = new Package("Weekly", BigDecimal.valueOf(20), 7, true);
//     // Package pkg2 = new Package("Monthly", BigDecimal.valueOf(50), 30, true);

//     // when(packageRepository.findAll()).thenReturn(Arrays.asList(pkg1, pkg2));

//     // List<Package> packages = packageService.getAllPackages();

//     // assertEquals(2, packages.size());
//     // assertEquals("Weekly", packages.get(0).getName());
//     // }

//     // @Test
//     // void testGetPackageById() {
//     // Package pkg = new Package("Weekly", BigDecimal.valueOf(20), 7, true);
//     // when(packageRepository.findById(1)).thenReturn(Optional.of(pkg));

//     // Package result = packageService.getPackageById(1);

//     // assertNotNull(result);
//     // assertEquals("Weekly", result.getName());
//     // }
// }
