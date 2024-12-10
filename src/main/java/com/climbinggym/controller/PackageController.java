package com.climbinggym.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.climbinggym.entity.Package;
import com.climbinggym.service.PackageService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/packages")
public class PackageController {

    private final PackageService packageService;

    @Autowired
    public PackageController(PackageService packageService) {
        this.packageService = packageService;
    }

    @PostMapping
    public Package createPackage(@RequestBody Package pkg) {
        // Ensure the package availability is set (if not provided, default to true)
        if (pkg.getAvailable() == null) {
            pkg.setAvailable(true); // default to true if not provided
        }
        return packageService.addPackage(pkg);
    }

    @GetMapping
    public List<Package> getAllPackages() {
        return packageService.getAllPackages();
    }

    @GetMapping("/active")
    public List<Package> getAllActivePackages() {
        return packageService.getAllActivePackages();
    }
    
    @GetMapping("/{id}")
    public Package getPackageById(@PathVariable Long id) {
        return packageService.getPackageById(id).orElseThrow(() -> new RuntimeException("Package not found"));
    }

    @DeleteMapping("/{id}")
    public void deletePackage(@PathVariable Long id) {
        packageService.deletePackage(id);
    }

    // Optional: Update package (for example, to toggle availability)
    @PutMapping("/{id}")
    public Package updatePackage(@PathVariable Long id, @RequestBody Package updatedPackage) {
        Optional<Package> existingPackage = packageService.getPackageById(id);
        if (existingPackage.isPresent()) {
            Package pkg = existingPackage.get();
            pkg.setName(updatedPackage.getName());
            pkg.setPrice(updatedPackage.getPrice());
            pkg.setDuration(updatedPackage.getDuration());
            pkg.setAvailable(updatedPackage.getAvailable()); // Update availability
            return packageService.addPackage(pkg); // save the updated package
        } else {
            throw new RuntimeException("Package not found");
        }
    }
}
