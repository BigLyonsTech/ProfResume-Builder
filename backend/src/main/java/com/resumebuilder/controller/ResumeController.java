package com.resumebuilder.controller;

import com.resumebuilder.model.Resume;
import com.resumebuilder.service.ResumeService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {
    private static final Logger log = LoggerFactory.getLogger(ResumeController.class);
    private final ResumeService resumeService;
    public ResumeController(ResumeService resumeService) { this.resumeService = resumeService; }

    @PostMapping
    public ResponseEntity<Resume> createResume(@Valid @RequestBody Resume resume) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resumeService.createResume(resume));
    }
    @GetMapping
    public ResponseEntity<List<Resume>> getAllResumes(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty())
            return ResponseEntity.ok(resumeService.searchByTitle(search.trim()));
        return ResponseEntity.ok(resumeService.getAllResumes());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResumeById(@PathVariable Long id) {
        return ResponseEntity.ok(resumeService.getResumeById(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Resume> updateResume(@PathVariable Long id, @Valid @RequestBody Resume resume) {
        return ResponseEntity.ok(resumeService.updateResume(id, resume));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable Long id) {
        resumeService.deleteResume(id); return ResponseEntity.noContent().build();
    }
}
