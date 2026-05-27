package com.resumebuilder.controller;

import com.resumebuilder.model.Education;
import com.resumebuilder.service.EducationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resumes/{resumeId}/educations")
public class EducationController {
    private final EducationService educationService;
    public EducationController(EducationService educationService) { this.educationService = educationService; }

    @PostMapping
    public ResponseEntity<Education> createEducation(@PathVariable Long resumeId, @Valid @RequestBody Education education) {
        return ResponseEntity.status(HttpStatus.CREATED).body(educationService.createEducation(resumeId, education));
    }
    @GetMapping
    public ResponseEntity<List<Education>> getAllEducations(@PathVariable Long resumeId) {
        return ResponseEntity.ok(educationService.getEducationsByResumeId(resumeId));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Education> getEducationById(@PathVariable Long resumeId, @PathVariable Long id) {
        return ResponseEntity.ok(educationService.getEducationById(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Education> updateEducation(@PathVariable Long resumeId, @PathVariable Long id, @Valid @RequestBody Education education) {
        return ResponseEntity.ok(educationService.updateEducation(id, education));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable Long resumeId, @PathVariable Long id) {
        educationService.deleteEducation(id); return ResponseEntity.noContent().build();
    }
}
