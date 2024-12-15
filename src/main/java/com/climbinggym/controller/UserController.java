package com.climbinggym.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.climbinggym.entity.User;
import com.climbinggym.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody User user) {
        User createdUser = userService.addUser(user);
        return ResponseEntity.ok(createdUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getUser(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/membership")
    public ResponseEntity<Void> updateMembership(@PathVariable Long id, @RequestParam LocalDate expirationDate) {
        userService.updateMembership(id, expirationDate);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/membership-status")
    public ResponseEntity<Boolean> isMembershipActive(@PathVariable Long id) {
        boolean isActive = userService.isMembershipActive(id);
        return ResponseEntity.ok(isActive);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
