package com.climbinggym.service;

import java.time.LocalDate;
import java.util.List;

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

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void updateMembership(Long id, LocalDate expirationDate) {
        User user = getUser(id); // Ensures user exists
        user.setExpirationDate(expirationDate);
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
