package com.climbinggym.service;

import java.util.List;

import com.climbinggym.entity.Package;

public interface PackageService {
    Package addPackage(Package pkg);
    List<Package> getAllPackages(); 
    List<Package> getAllActivePackages(); 
    Package getPackageById(Integer id); 
    void deletePackage(Integer id);
}
