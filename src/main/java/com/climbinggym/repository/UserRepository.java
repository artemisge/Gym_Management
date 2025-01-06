package com.climbinggym.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.climbinggym.entity.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email); 

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}
