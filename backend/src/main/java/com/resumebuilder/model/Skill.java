package com.resumebuilder.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "skills")
public class Skill {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonBackReference("resume-skills")
    private Resume resume;

    @NotBlank(message = "Skill name is required")
    @Size(min = 1, max = 50, message = "Skill name must be between 1 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s#+.()/\\-]+$",
             message = "Skill name can contain letters, numbers, spaces, and: + # . ( ) / -")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "Proficiency level is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProficiencyLevel proficiencyLevel;

    public Skill() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public ProficiencyLevel getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }
}
