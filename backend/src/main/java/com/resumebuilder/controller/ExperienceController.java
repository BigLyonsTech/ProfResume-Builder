package com.resumebuilder.controller;

import com.resumebuilder.model.Experience;
import com.resumebuilder.service.ExperienceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resumes/{resumeId}/experiences")
public class ExperienceController {
    private final ExperienceService experienceService;
    public ExperienceController(ExperienceService experienceService) { this.experienceService = experienceService; }

    @PostMapping
    public ResponseEntity<Experience> createExperience(@PathVariable Long resumeId, @Valid @RequestBody Experience experience) {
        return ResponseEntity.status(HttpStatus.CREATED).body(experienceService.createExperience(resumeId, experience));
    }
    @GetMapping
    public ResponseEntity<List<Experience>> getAllExperiences(@PathVariable Long resumeId) {
        return ResponseEntity.ok(experienceService.getExperiencesByResumeId(resumeId));
    }
    @GetMapping("/current")
    public ResponseEntity<List<Experience>> getCurrentJobs(@PathVariable Long resumeId) {
        return ResponseEntity.ok(experienceService.getCurrentJobs(resumeId));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Experience> getExperienceById(@PathVariable Long resumeId, @PathVariable Long id) {
        return ResponseEntity.ok(experienceService.getExperienceById(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Experience> updateExperience(@PathVariable Long resumeId, @PathVariable Long id, @Valid @RequestBody Experience experience) {
        return ResponseEntity.ok(experienceService.updateExperience(id, experience));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long resumeId, @PathVariable Long id) {
        experienceService.deleteExperience(id); return ResponseEntity.noContent().build();
    }
}
