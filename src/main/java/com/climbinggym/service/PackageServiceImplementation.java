package com.climbinggym.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.climbinggym.entity.Package;
import com.climbinggym.repository.PackageRepository;
import java.util.List;

@Service
public class PackageServiceImplementation implements PackageService {

    private final PackageRepository packageRepository;

    @Autowired
    public PackageServiceImplementation(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    @Override
    public Package addPackage(Package pkg) {
        return packageRepository.save(pkg);
    }

    @Override
    public List<Package> getAllPackages() {
        return packageRepository.findAll();
    }
    
    @Override
    public List<Package> getAllActivePackages() {
        return packageRepository.findByAvailableTrue();
    }

    @Override
    public Package getPackageById(Integer id) {
        return packageRepository.findById(id).orElseThrow(() -> new RuntimeException("Package not found with ID: " + id));
    }

    @Override
    public void deletePackage(Integer id) {
        packageRepository.deleteById(id);
    }
}
