package com.climbinggym.service;

import java.time.LocalDate;
import java.util.List;
import com.climbinggym.entity.Package;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import com.climbinggym.entity.User;
import com.climbinggym.repository.UserRepository;

@Service
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;
    private final QRCodeService qrCodeService;
    private final EmailService emailService;

    public UserServiceImplementation(UserRepository userRepository, QRCodeService qrCodeService,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.qrCodeService = qrCodeService;
        this.emailService = emailService;
    }

    @Override
    public User addUser(User user) {
        try {
            userRepository.save(user);
            System.out.println("User saved successfully: " + user);

            // Generate QR code after user is saved
            try {
                String qrcode = qrCodeService.generateQRCodeForUser(user.getId(), user.getName());

                // emailService.sendEmail(user.getEmail(), "welcome to gym",
                //         "QR CODE for membership, scan to enter the gym if membership is active.", qrcode);
            } catch (Exception e) {
                System.err.println("Error generating QR code for user: " + user.getId());
                e.printStackTrace();
            }

            return user;
        } catch (DataIntegrityViolationException e) {
            System.err.println("Error: Duplicate email or phone detected!");
            return null;
        }
    }

    @Override
    public User getUser(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    public User updateUser(Integer id, User updatedUser) {
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
    public void updateMembership(Integer userId, Package purchasedPackage) {
        // Fetch the user by ID
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Get the current membership expiration date (if any)
        LocalDate currentExpirationDate = user.getExpirationDate();

        // If the user doesn't have an active membership, set the expiration to the
        // current date plus package duration
        if (currentExpirationDate == null || currentExpirationDate.isBefore(LocalDate.now())) {
            user.setExpirationDate(LocalDate.now().plusDays(purchasedPackage.getDurationInDays()));
        } else {
            // If the user already has an active membership, extend the expiration date by
            // the package's duration
            user.setExpirationDate(currentExpirationDate.plusDays(purchasedPackage.getDurationInDays()));
        }

        // Save the user with the updated membership expiration date
        userRepository.save(user);
    }

    @Override
    public boolean isMembershipActive(Integer id) {
        User user = getUser(id);
        return user.isMembershipActive();
    }

    @Override
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);

        // Delegate QR code deletion to the QRCodeGeneratorService
        try {
            qrCodeService.deleteQRCodeForUser(id.intValue());
        } catch (Exception e) {
            System.err.println("Error deleting QR code for user ID: " + id);
            e.printStackTrace();
        }
    }

    // Method to check if email is unique
    public boolean isEmailUnique(String email) {
        return !userRepository.existsByEmail(email); // Returns true if email does not exist
    }

    // Method to check if phone is unique
    public boolean isPhoneUnique(String phone) {
        return !userRepository.existsByPhone(phone); // Returns true if phone does not exist
    }

    public LocalDate getMembershipExpirationDate(Integer userId) {
        User user = getUser(userId);
        return user.getExpirationDate();
    }

}
