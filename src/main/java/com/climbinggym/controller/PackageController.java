package com.climbinggym.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.climbinggym.entity.Package;
import com.climbinggym.service.PackageService;
import java.util.List;

@RestController
@CrossOrigin
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
            pkg.setAvailable(true);
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
    public Package getPackageById(@PathVariable Integer id) {
        // fetch the package or throw an exception from the service
        return packageService.getPackageById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable Integer id) {
        try {
            packageService.deletePackage(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PutMapping("/{id}")
    public Package updatePackage(@PathVariable Integer id, @RequestBody Package updatedPackage) {
        // Fetch the existing package or throw an exception from the service
        Package existingPackage = packageService.getPackageById(id);

        // Update the fields of the existing package
        existingPackage.setName(updatedPackage.getName());
        existingPackage.setPrice(updatedPackage.getPrice());
        existingPackage.setDurationInDays(updatedPackage.getDurationInDays());
        existingPackage.setAvailable(updatedPackage.getAvailable());

        // Save the updated package
        return packageService.addPackage(existingPackage);
    }
}
