package com.climbinggym.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "PACKAGES")
public class Package {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;  // e.g., "1 Month", "3 Months", "Yearly"
    private BigDecimal price; // Price of the package

    @JsonProperty("durationInDays")
    @Column(name = "duration_in_days")
    private Integer durationInDays; 

    private Boolean available; // Indicates if the package is available for purchase

    // @OneToMany(mappedBy = "packageType", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Payment> payments = new ArrayList<>();


    public Package() {
        // empty for hibernate
    }

    public Package(String name, BigDecimal price, Integer durationInDays, Boolean available) {
        this.name = name;
        this.price = price;
        this.durationInDays = durationInDays;
        this.available = available;
    }

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

    public Integer getDurationInDays() {
        return durationInDays;
    }

    public void setDurationInDays(Integer durationInDays) {
        this.durationInDays = durationInDays;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }
}
