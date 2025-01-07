package com.climbinggym.entity;

import static org.junit.jupiter.api.Assertions.*;
import java.time.LocalDate;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.assertj.core.api.Assertions.assertThat;

import com.climbinggym.repository.UserRepository;

import jakarta.transaction.Transactional;

@ActiveProfiles("test")
@SpringBootTest
@Transactional
class UserTest {
    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    // @Rollback
    void setUp() {
        // Initialize a User object before each test
        user = new User("Mpampis", "mpampis@oflou.com", "+1234567890");
    }

    // Entity Tests
    @Test
    void testConstructor() {
        assertEquals("Mpampis", user.getName());
        assertEquals("mpampis@oflou.com", user.getEmail());
        assertEquals("+1234567890", user.getPhone());
        assertNull(user.getExpirationDate(), "Membership expiration should be null for new users");
    }

    @Test
    void testSettersAndGetters() {
        user.setName("Jane Smith");
        user.setEmail("jane@example.com");
        user.setPhone("+9876543210");
        user.setExpirationDate(LocalDate.of(2025, 1, 1));

        assertEquals("Jane Smith", user.getName());
        assertEquals("jane@example.com", user.getEmail());
        assertEquals("+9876543210", user.getPhone());
        assertEquals(LocalDate.of(2025, 1, 1), user.getExpirationDate());
    }

    @Test
    void testIsMembershipActive() {
        // Test when membershipExpirationDate is null
        assertFalse(user.isMembershipActive(), "Membership should not be active if expiration date is null");

        // Test when membershipExpirationDate is in the future
        user.setExpirationDate(LocalDate.now().plusDays(30));
        assertTrue(user.isMembershipActive(), "Membership should be active if expiration date is in the future");

        // Test when membershipExpirationDate is in the past
        user.setExpirationDate(LocalDate.now().minusDays(1));
        assertFalse(user.isMembershipActive(), "Membership should not be active if expiration date is in the past");
    }

    @Test
    void testUpdateMembershipExpirationDate() {
        // Set expiration date and verify
        LocalDate newExpirationDate = LocalDate.of(2025, 12, 31);
        user.setExpirationDate(newExpirationDate);
        assertEquals(newExpirationDate, user.getExpirationDate());
    }

    // Repository Tests
    @Test
    @Rollback
    void testSaveAndRetrieveUser() {
        // Save a new user
        user.setExpirationDate(LocalDate.of(2025, 1, 1));
        userRepository.save(user);

        // Retrieve the user
        Optional<User> retrievedUser = userRepository.findById(user.getId());
        assertThat(retrievedUser).isPresent();
        assertThat(retrievedUser.get().getName()).isEqualTo("Mpampis");
        assertThat(retrievedUser.get().getExpirationDate()).isEqualTo(LocalDate.of(2025, 1, 1));
    }

    @Test
    void testUpdateUser() {
        // Save a user
        userRepository.save(user);

        // Update the user's details
        user.setName("Jane Smith");
        user.setExpirationDate(LocalDate.now().plusDays(30));
        userRepository.save(user);

        // Verify the update
        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        assertThat(updatedUser.getName()).isEqualTo("Jane Smith");
        assertThat(updatedUser.getExpirationDate()).isEqualTo(LocalDate.now().plusDays(30));
    }

    @Test
    void testDeleteUser() {
        // Save a user
        userRepository.save(user);

        System.out.println("================ [4]save user: findAll + findById=============");
        System.out.println(userRepository.findAll()); 
        System.out.println(userRepository.findById(user.getId())); 
        System.out.println("================ [5]delete user: findAll + findById=============");

        // Delete the user
        userRepository.delete(user);

        System.out.println(userRepository.findAll()); 
        System.out.println(userRepository.findById(user.getId())); 
        System.out.println("================ [6]check delete: findById=============");

        // Verify deletion
        Optional<User> deletedUser = userRepository.findById(user.getId());
        assertThat(deletedUser).isEmpty();
    }

    @Test
    void testFindByEmail() {
        // Save a user
        user.setEmail("unique@domain.com");
        userRepository.save(user);

        // Retrieve the user by email
        Optional<User> retrievedUser = userRepository.findByEmail("unique@domain.com");

        assertThat(retrievedUser).isPresent(); // Checks if Optional contains a value

        assertThat(retrievedUser).isPresent();
        assertThat(retrievedUser.get().getName()).isEqualTo("Mpampis");
    }

    @Test
    void testUserEntityWithRepository() {
        // Save a user
        user.setExpirationDate(LocalDate.now().plusDays(10));
        userRepository.save(user);

        // Retrieve and verify entity behavior
        User retrievedUser = userRepository.findById(user.getId()).orElseThrow();
        assertTrue(retrievedUser.isMembershipActive(), "Membership should be active");
    }
}
