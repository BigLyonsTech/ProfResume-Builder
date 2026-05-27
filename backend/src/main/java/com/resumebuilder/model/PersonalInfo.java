package com.resumebuilder.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "personal_info")
public class PersonalInfo {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonBackReference("resume-personalInfo")
    private Resume resume;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s''\\-]+$",
             message = "Full name must contain letters only (spaces, hyphens and apostrophes allowed)")
    @Column(nullable = false)
    private String fullName;

    @NotBlank(message = "Email address is required")
    @Email(message = "Must be a valid email address")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+]?[0-9]{7,15}$",
             message = "Phone number must contain 7-15 digits (optional leading +)")
    @Column(nullable = false)
    private String phone;

    @NotBlank(message = "Address is required")
    @Size(max = 255, message = "Address must not exceed 255 characters")
    @Column(nullable = false)
    private String address;

    @NotBlank(message = "Professional summary is required")
    @Size(min = 50, max = 500, message = "Summary must be between 50 and 500 characters")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String summary;

    @Pattern(regexp = "^$|^(https?://)?(www\\.)?linkedin\\.com/.*$",
             message = "Must be a valid LinkedIn URL")
    private String linkedIn;

    @Pattern(regexp = "^$|^(https?://)?(www\\.)?github\\.com/.*$",
             message = "Must be a valid GitHub URL")
    private String github;

    @Pattern(regexp = "^$|^(https?://).*$",
             message = "Must be a valid URL starting with http:// or https://")
    private String portfolio;

    public PersonalInfo() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getLinkedIn() { return linkedIn; }
    public void setLinkedIn(String linkedIn) { this.linkedIn = linkedIn; }
    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }
    public String getPortfolio() { return portfolio; }
    public void setPortfolio(String portfolio) { this.portfolio = portfolio; }
}
