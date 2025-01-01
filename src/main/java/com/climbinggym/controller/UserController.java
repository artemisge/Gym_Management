package com.climbinggym.controller;

import java.io.File;
import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.climbinggym.entity.User;
import com.climbinggym.entity.Package;
import com.climbinggym.service.QRCodeService;

import com.climbinggym.service.UserService;

@RestController
@CrossOrigin
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final QRCodeService qrCodeService;

    public UserController(UserService userService, QRCodeService qrCodeService) {
        this.userService = userService;
        this.qrCodeService = qrCodeService;
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

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.updateUser(id, updatedUser);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/membership")
    public ResponseEntity<Void> updateMembership(@PathVariable Long id, @RequestBody Package purchasedPackage) {
        System.out.println("User ID: " + id);
        System.out.println("Purchased Package: " + purchasedPackage.getName());
        System.out.println("Duration in Days: " + purchasedPackage.getDurationInDays());

        userService.updateMembership(id, purchasedPackage);
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

    // Endpoint to check if email is already in use
    @GetMapping("/email/{email}")
    public ResponseEntity<?> isEmailUnique(@PathVariable String email) {
        boolean isUnique = userService.isEmailUnique(email);

        if (!isUnique) {
            return ResponseEntity.status(HttpStatus.CONFLICT) // 409 Conflict
                    .body("Email is already in use.");
        }

        return ResponseEntity.ok("Email is unique."); // 200 OK
    }

    // Endpoint to check if phone number is already in use
    @GetMapping("/phone/{phone}")
    public ResponseEntity<?> isPhoneUnique(@PathVariable String phone) {
        boolean isUnique = userService.isPhoneUnique(phone);

        if (!isUnique) {
            return ResponseEntity.status(HttpStatus.CONFLICT) // 409 Conflict
                    .body("Phone number is already in use.");
        }

        return ResponseEntity.ok("Phone number is unique."); // 200 OK
    }
}
