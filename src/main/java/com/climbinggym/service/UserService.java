package com.climbinggym.service;

import java.time.LocalDate;
import java.util.List;
import com.climbinggym.entity.Package; 
import com.climbinggym.entity.User;

public interface UserService {
    User addUser(User user);
    User getUser(Integer id);
    List<User> getAllUsers();
    void updateMembership(Integer userId, Package purchasedPackage);
    boolean isMembershipActive(Integer id);
    void deleteUser(Integer id);
    User updateUser(Integer id, User updatedUser);
    public boolean isPhoneUnique(String phone);
    public boolean isEmailUnique(String email);
    public LocalDate getMembershipExpirationDate(Integer userId);
}
