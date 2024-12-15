package com.climbinggym;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.climbinggym.entity") // Replace with your entity package path
public class ClimbingGymSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClimbingGymSystemApplication.class, args);
	}

}
