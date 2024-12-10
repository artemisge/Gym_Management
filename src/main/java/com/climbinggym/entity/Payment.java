package com.climbinggym.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date paymentDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Payment made by a specific user

    @ManyToOne
    @JoinColumn(name = "package_id")
    private Package packageType; // Payment associated with a specific package

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Package getPackageType() {
        return packageType;
    }

    public void setPackageType(Package packageType) {
        this.packageType = packageType;
    }
}
