package com.climbinggym.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.climbinggym.entity.Package;

// The PackageRepository extends JpaRepository to perform CRUD operations on the Package entity
public interface PackageRepository extends JpaRepository<Package, Long> {
    // Custom queries can be defined here if needed
    // For example, to find packages by their name:
    // List<Package> findByName(String name);
    List<Package> findByAvailableTrue();
}
