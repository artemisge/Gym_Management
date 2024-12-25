package com.climbinggym.service;

import java.time.LocalDate;
import java.util.List;
import com.climbinggym.entity.Package;  // Ensure this import is present
import com.climbinggym.entity.User;

public interface UserService {
    User addUser(User user);
    User getUser(Long id);
    List<User> getAllUsers();
    void updateMembership(Long userId, Package purchasedPackage);
    boolean isMembershipActive(Long id);
    void deleteUser(Long id);
    User updateUser(Long id, User updatedUser);
}
