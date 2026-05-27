package com.resumebuilder.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "experiences")
public class Experience {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonBackReference("resume-experiences")
    private Resume resume;

    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 150, message = "Company name must be between 2 and 150 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s&,'.()\"-]+$",
             message = "Company name can only contain letters, numbers, and standard punctuation")
    @Column(nullable = false)
    private String company;

    @NotBlank(message = "Job title is required")
    @Size(min = 2, max = 100, message = "Job title must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s&,'.()\"-]+$", message = "Job title must contain letters only")
    @Column(nullable = false)
    private String jobTitle;

    @NotBlank(message = "Job description is required")
    @Size(min = 20, max = 1000, message = "Description must be between 20 and 1000 characters")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @NotNull(message = "Start date is required")
    @PastOrPresent(message = "Start date cannot be in the future")
    @Column(nullable = false)
    private LocalDate startDate;

    @PastOrPresent(message = "End date cannot be in the future")
    private LocalDate endDate;

    @Column(nullable = false)
    private boolean currentlyWorking = false;

    public Experience() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public boolean isCurrentlyWorking() { return currentlyWorking; }
    public void setCurrentlyWorking(boolean currentlyWorking) { this.currentlyWorking = currentlyWorking; }
}
