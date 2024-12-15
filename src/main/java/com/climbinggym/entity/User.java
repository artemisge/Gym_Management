package com.climbinggym.entity;
import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "USERS")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    @Column(unique = true)
    private String email;
    @Column(unique = true)
    private String phone;
    @Column(name = "membership_expiration") 
    private LocalDate membershipExpirationDate;

    public User(){
        // empty constructor for hibernate
    }

    public User(String name, String email, String phone, LocalDate membershipExpirationDate){
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
