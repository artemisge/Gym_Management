package com.climbinggym;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import com.climbinggym.entity.User;
import com.climbinggym.repository.UserRepository;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
@EntityScan(basePackages = "com.climbinggym.entity") // Replace with your entity package path
public class ClimbingGymSystemApplication {

    @Autowired
    private UserRepository userRepository;

	@PostConstruct
    public void init() {
        System.out.println("HEEEERREEEEE");
		
		User newuser = new User("Galaxar", "galaxar@gmail.com", "100");
		userRepository.save(newuser);
    }

	public static void main(String[] args) {
		SpringApplication.run(ClimbingGymSystemApplication.class, args);
	}

}
