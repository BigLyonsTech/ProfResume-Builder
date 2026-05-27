package com.resumebuilder.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "educations")
public class Education {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonBackReference("resume-educations")
    private Resume resume;

    @NotBlank(message = "School name is required")
    @Size(min = 2, max = 150, message = "School name must be between 2 and 150 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s&,'.()\"-]+$",
             message = "School name can only contain letters, numbers, and standard punctuation")
    @Column(nullable = false)
    private String school;

    @NotBlank(message = "Degree is required")
    @Size(min = 2, max = 100, message = "Degree must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s.]+$", message = "Degree must contain letters only")
    @Column(nullable = false)
    private String degree;

    @NotBlank(message = "Field of study is required")
    @Size(min = 2, max = 100, message = "Field of study must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s&,'.()\"-]+$", message = "Field of study must contain letters only")
    @Column(nullable = false)
    private String fieldOfStudy;

    @NotNull(message = "Start year is required")
    @Min(value = 1950, message = "Start year must be 1950 or later")
    @Max(value = 2100, message = "Start year is not valid")
    @Column(nullable = false)
    private Integer startYear;

    @Min(value = 1950, message = "End year must be 1950 or later")
    @Max(value = 2100, message = "End year is not valid")
    private Integer endYear;

    // Removed @Digits — incompatible with Hibernate 6.4 on floating point types
    // @DecimalMin and @DecimalMax are sufficient for validation
    @DecimalMin(value = "0.0", message = "GPA must be at least 0.0")
    @DecimalMax(value = "4.0", message = "GPA must not exceed 4.0")
    private Double gpa;

    @Column(nullable = false)
    private boolean currentlyStudying = false;

    public Education() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    public String getSchool() { return school; }
    public void setSchool(String school) { this.school = school; }
    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }
    public String getFieldOfStudy() { return fieldOfStudy; }
    public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }
    public Integer getStartYear() { return startYear; }
    public void setStartYear(Integer startYear) { this.startYear = startYear; }
    public Integer getEndYear() { return endYear; }
    public void setEndYear(Integer endYear) { this.endYear = endYear; }
    public Double getGpa() { return gpa; }
    public void setGpa(Double gpa) { this.gpa = gpa; }
    public boolean isCurrentlyStudying() { return currentlyStudying; }
    public void setCurrentlyStudying(boolean currentlyStudying) { this.currentlyStudying = currentlyStudying; }
}
