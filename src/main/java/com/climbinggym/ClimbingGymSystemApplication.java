package com.climbinggym;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.repository.CrudRepository;

import com.climbinggym.entity.Payment;
import com.climbinggym.entity.User;
import com.climbinggym.entity.Package;

import com.climbinggym.repository.UserRepository;
import com.climbinggym.service.PackageService;
import com.climbinggym.service.PaymentService;
import com.climbinggym.service.UserService;

import jakarta.annotation.PostConstruct;
import com.github.javafaker.Faker;
import java.io.File;


@SpringBootApplication
@EntityScan(basePackages = "com.climbinggym.entity")
public class ClimbingGymSystemApplication {

	@Autowired
	private UserService userService;
	@Autowired
	private PackageService packageService;
	@Autowired
	private PaymentService paymentService;
	
	private static final String QR_CODE_DIRECTORY = "climbing-gym-system/src/main/resources/static/qrcodes/";


	public void clearQRCodeDirectory() {
		File qrDirectory = new File(QR_CODE_DIRECTORY);
		if (qrDirectory.exists() && qrDirectory.isDirectory()) {
			File[] files = qrDirectory.listFiles(); // List files in the directory
			if (files != null) { // Ensure files are not null
				for (File file : files) {
					if (file.isFile() && file.getName().endsWith(".png")) { // Check it's a file and ends with .png
						boolean deleted = file.delete(); // Delete the file
						if (deleted) {
							System.out.println("Deleted QR code file: " + file.getName());
						} else {
							System.err.println("Failed to delete QR code file: " + file.getName());
						}
					}
				}
			} else {
				System.out.println("No files to delete in QR code directory.");
			}
		} else {
			System.out.println("QR code directory does not exist or is not a directory.");
		}
	}

	// Helper method to generate valid phone numbers
	private String generateValidPhoneNumber(Random random) {
		StringBuilder phoneBuilder = new StringBuilder();

		if (random.nextBoolean()) {
			phoneBuilder.append("+");
		}

		// Generate 10 to 15 digits
		int length = 10 + random.nextInt(6); // Random length between 10 and 15
		for (int i = 0; i < length; i++) {
			phoneBuilder.append(random.nextInt(10)); // Append a random digit (0–9)
		}

		return phoneBuilder.toString();
	}

	// creates N users (for-loop) with fake data for testing
	public void createFakeData() {
		Faker faker = new Faker();
		Random random = new Random();

		for (int i = 0; i < 1; i++) {
			String phone = generateValidPhoneNumber(random);
			User user = new User(
				faker.name().fullName(), 
				faker.internet().emailAddress(), 
				phone
			);
			
			userService.addUser(user);
		}

		// packages creation
		Package monthlyPackage = new Package("1 Month", new BigDecimal("30.00"), 30, true);
		Package yearlyPackage = new Package("1 Year", new BigDecimal("300.00"), 365, true);
		Package holidayPackage = new Package("Xmas Offer", new BigDecimal("70.00"), 90, false);

		// Save packages
		packageService.addPackage(monthlyPackage);
		packageService.addPackage(yearlyPackage);
		packageService.addPackage(holidayPackage);

		// Add sample payments to User 1
		// Retrieve user with ID 1
		User user = userService.getUser(1);

		// Retrieve package with ID 2
		Package packageType = packageService.getPackageById(2);

		// Create payment 1
		Payment payment1 = new Payment();
		payment1.setUser(user);
		payment1.setPackageType(packageType);
		payment1.setPaymentDate(LocalDate.now());

		// Create payment 2
		Payment payment2 = new Payment();
		payment2.setUser(user);
		payment2.setPackageType(packageType);
		payment2.setPaymentDate(LocalDate.now().minusMonths(1));

		// Save payments
		paymentService.makePayment(payment1);
        paymentService.makePayment(payment2);
		
	}
	

	@PostConstruct
    public void init() {
		clearQRCodeDirectory(); // Clear QR codes before starting the app
		createFakeData();
    }

	public static void main(String[] args) {
		SpringApplication.run(ClimbingGymSystemApplication.class, args);
	}

}
