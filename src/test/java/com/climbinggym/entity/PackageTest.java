package com.climbinggym.entity;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import com.climbinggym.repository.PackageRepository;

import jakarta.transaction.Transactional;

@ActiveProfiles("test")
@SpringBootTest
@Transactional
public class PackageTest {

    @Autowired
    private PackageRepository packageRepository;

    @Test
    void testSaveAndRetrievePackage() {
        // Create and Save Package
        Package packageEntity = new Package("3 Months", BigDecimal.valueOf(150.00), 90, true);
        System.out.println(packageEntity.getName());
        packageRepository.save(packageEntity);

        // Retrieve Package
        Package retrievedPackage = packageRepository.findById(packageEntity.getId()).orElse(null);

        assertThat(retrievedPackage).isNotNull();
        assertThat(retrievedPackage.getName()).isEqualTo("3 Months");
        assertThat(retrievedPackage.getPrice().compareTo(BigDecimal.valueOf(150.00))).isZero();
        assertThat(retrievedPackage.getDurationInDays()).isEqualTo(90);
        assertThat(retrievedPackage.getAvailable()).isTrue();
    }

    @Test
    void testUpdatePackage() {
        // Create and Save Package
        Package packageEntity = new Package("Monthly", BigDecimal.valueOf(50.00), 30, true);
        packageRepository.save(packageEntity);

        // Update Package
        Package retrievedPackage = packageRepository.findById(packageEntity.getId()).orElse(null);
        if (retrievedPackage != null) {
            retrievedPackage.setName("Yearly");
            retrievedPackage.setPrice(BigDecimal.valueOf(500.00));
            retrievedPackage.setDurationInDays(365);
            retrievedPackage.setAvailable(false);
            packageRepository.save(retrievedPackage);
        }

        // Verify Update
        Package updatedPackage = packageRepository.findById(packageEntity.getId()).orElse(null);

        assertThat(updatedPackage).isNotNull();
        assertThat(updatedPackage.getName()).isEqualTo("Yearly");
        assertThat(updatedPackage.getPrice().compareTo(BigDecimal.valueOf(500.00))).isZero();
        assertThat(updatedPackage.getDurationInDays()).isEqualTo(365);
        assertThat(updatedPackage.getAvailable()).isFalse();
    }

    @Test
    void testDeletePackage() {
        // Create and Save Package
        Package packageEntity = new Package("Weekly", BigDecimal.valueOf(20.00), 7, true);
        packageRepository.save(packageEntity);

        // Delete Package
        packageRepository.delete(packageEntity);

        // Verify Deletion
        Package deletedPackage = packageRepository.findById(packageEntity.getId()).orElse(null);
        assertThat(deletedPackage).isNull();
    }

    @Test
    void testNullValues() {
        // Create and Save Package with Null Duration and Availability
        Package packageEntity = new Package("Custom", BigDecimal.valueOf(75.00), null, null);
        packageRepository.save(packageEntity);

        // Retrieve Package
        Package retrievedPackage = packageRepository.findById(packageEntity.getId()).orElse(null);
        
        assertThat(retrievedPackage).isNotNull();
        assertThat(retrievedPackage.getDurationInDays()).isNull();
        assertThat(retrievedPackage.getAvailable()).isNull();
    }
}
