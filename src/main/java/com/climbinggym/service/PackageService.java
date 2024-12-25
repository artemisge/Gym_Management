package com.climbinggym.service;

import java.util.List;
import java.util.Optional;

import com.climbinggym.entity.Package;

public interface PackageService {
    Package addPackage(Package pkg); // Add a new package
    List<Package> getAllPackages(); // Get all packages (including unavailable ones)
    List<Package> getAllActivePackages(); // Get only available packages
    Package getPackageById(Long id); // Get a package by ID
    void deletePackage(Long id); // Delete a package
}
