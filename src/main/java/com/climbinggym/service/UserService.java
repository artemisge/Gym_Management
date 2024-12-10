package com.climbinggym.service;

import java.util.Date;
import java.util.List;

import com.climbinggym.entity.User;

public interface UserService {
    User addUser(User user);
    User getUser(Long id);
    List<User> getAllUsers();
    void updateMembership(Long id, Date expirationDate);
    boolean isMembershipActive(Long id);
    void deleteUser(Long id);
}
