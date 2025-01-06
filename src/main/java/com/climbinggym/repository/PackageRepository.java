package com.climbinggym.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.climbinggym.entity.Package;

public interface PackageRepository extends JpaRepository<Package, Integer> {

    List<Package> findByAvailableTrue();
}
