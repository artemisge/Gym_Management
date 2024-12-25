package com.climbinggym.service;

import java.time.LocalDate;
import java.util.List;
import com.climbinggym.entity.Package;  // Ensure this import is present

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.climbinggym.entity.User;
import com.climbinggym.repository.UserRepository;

@Service
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;

    public UserServiceImplementation(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User addUser(User user) {
        try {
            userRepository.save(user);
            System.out.println("User saved successfully: " + user);
            return user;
        } catch (DataIntegrityViolationException e) {
            System.err.println("Error: Duplicate email or phone detected!");
            return null;
        }
    }

    @Override
    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    
        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setExpirationDate(updatedUser.getExpirationDate());
        
        return userRepository.save(existingUser);
    }
    

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void updateMembership(Long userId, Package purchasedPackage) {
        // Fetch the user by ID
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Get the current membership expiration date (if any)
        LocalDate currentExpirationDate = user.getExpirationDate();

        // If the user doesn't have an active membership, set the expiration to the current date plus package duration
        if (currentExpirationDate == null || currentExpirationDate.isBefore(LocalDate.now())) {
            user.setExpirationDate(LocalDate.now().plusDays(purchasedPackage.getDurationInDays()));
        } else {
            // If the user already has an active membership, extend the expiration date by the package's duration
            user.setExpirationDate(currentExpirationDate.plusDays(purchasedPackage.getDurationInDays()));
        }

        // Save the user with the updated membership expiration date
        userRepository.save(user);
    }

    @Override
    public boolean isMembershipActive(Long id) {
        User user = getUser(id);
        return user.isMembershipActive();
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
