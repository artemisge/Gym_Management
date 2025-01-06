package com.climbinggym.entity;

import java.time.LocalDate;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import jakarta.persistence.*;

@Entity
@Table(name = "PAYMENTS")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(foreignKeyDefinition = "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE"))
    // @OnDelete(action = OnDeleteAction.CASCADE)
    private User user; // Payment made by a specific user

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "package_id", nullable = false, foreignKey = @ForeignKey(foreignKeyDefinition = "FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE"))
    // @OnDelete(action = OnDeleteAction.CASCADE)
    private Package packageType; // Payment associated with a specific package

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
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
