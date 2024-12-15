package com.climbinggym.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;


@Entity
@Table(name = "PACKAGES")
public class Package {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;  // e.g., "1 Month", "3 Months", "Yearly"
    private BigDecimal price; // Price of the package
    @Column(name = "duration_in_days")
    private Integer durationInDays;  // Duration in days (or months)
    private Boolean available; // Indicates if the package is available for purchase

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getDuration() {
        return durationInDays;
    }

    public void setDuration(Integer durationInDays) {
        this.durationInDays = durationInDays;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }
}
