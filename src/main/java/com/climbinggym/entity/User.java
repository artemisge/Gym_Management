package com.climbinggym.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "USERS")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    // email and phone must be unique
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String phone;

    // user can be active/inactive based on the membership expiration date
    @Column(name = "membership_expiration") 
    private LocalDate membershipExpirationDate;
    
    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Payment> payments = new ArrayList<>();

    public User(){
        // empty constructor for hibernate
    }

    public User(String name, String email, String phone){
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.membershipExpirationDate = null; //user has no membership when generated

    }

    // Utility method to check membership status
    public boolean isMembershipActive() {
        return membershipExpirationDate != null && membershipExpirationDate.isAfter(LocalDate.now());
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getExpirationDate() {
        return membershipExpirationDate;
    }

    public void setExpirationDate(LocalDate membershipExpirationDate) {
        this.membershipExpirationDate = membershipExpirationDate;
    }
}
