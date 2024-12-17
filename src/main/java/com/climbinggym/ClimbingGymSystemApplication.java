package com.climbinggym;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import com.climbinggym.entity.Payment;
import com.climbinggym.entity.User;
import com.climbinggym.entity.Package;

import com.climbinggym.repository.UserRepository;
import com.climbinggym.service.PackageService;
import com.climbinggym.service.UserService;

import jakarta.annotation.PostConstruct;
import com.github.javafaker.Faker;


@SpringBootApplication
@EntityScan(basePackages = "com.climbinggym.entity") // Replace with your entity package path
public class ClimbingGymSystemApplication {

    @Autowired
	private UserService userService;
	@Autowired
	private PackageService packageService;

	public void createFakeData() {
		Faker faker = new Faker();
		for (int i = 0; i < 100; i++) {
			// Using the parameterized constructor to ensure non-nullable fields are set
			User user = new User(faker.name().fullName(), faker.internet().emailAddress(), faker.phoneNumber().phoneNumber());
			
			// Optionally, you can set the membership expiration date to a random future date
			// user.setExpirationDate(faker.date().future(1, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
	
			// Optionally, you can create fake payments here as well
			// Payment payment = new Payment();
			// payment.setDate(faker.date().past(30, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
			// payment.setAmount(faker.number().randomDouble(2, 10, 100));
			// payment.setPackageType(faker.commerce().productName());
			// payment.setUser(user);
	
			userService.addUser(user);
			// If you want to save the payment:
			// paymentRepository.save(payment);
		}

		// packages creation
		Package monthlyPackage = new Package("1 Month", new BigDecimal("30.00"), 30, true);
		Package yearlyPackage = new Package("1 Year", new BigDecimal("300.00"), 365, true);
		Package holidayPackage = new Package("Xmas Offer", new BigDecimal("70.00"), 90, false);

		// Save packages
		packageService.addPackage(monthlyPackage);
		packageService.addPackage(yearlyPackage);
		packageService.addPackage(holidayPackage);
	}
	

	@PostConstruct
    public void init() {
		createFakeData();
    }

	public static void main(String[] args) {
		SpringApplication.run(ClimbingGymSystemApplication.class, args);
	}

}
