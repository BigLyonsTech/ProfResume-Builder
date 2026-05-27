package com.resumebuilder.controller;

import com.resumebuilder.model.PersonalInfo;
import com.resumebuilder.service.PersonalInfoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resumes/{resumeId}/personal-info")
public class PersonalInfoController {
    private final PersonalInfoService personalInfoService;
    public PersonalInfoController(PersonalInfoService personalInfoService) { this.personalInfoService = personalInfoService; }

    @PostMapping
    public ResponseEntity<PersonalInfo> createPersonalInfo(@PathVariable Long resumeId, @Valid @RequestBody PersonalInfo personalInfo) {
        return ResponseEntity.status(HttpStatus.CREATED).body(personalInfoService.createPersonalInfo(resumeId, personalInfo));
    }
    @GetMapping
    public ResponseEntity<PersonalInfo> getPersonalInfo(@PathVariable Long resumeId) {
        return ResponseEntity.ok(personalInfoService.getPersonalInfoByResumeId(resumeId));
    }
    @PutMapping
    public ResponseEntity<PersonalInfo> updatePersonalInfo(@PathVariable Long resumeId, @Valid @RequestBody PersonalInfo personalInfo) {
        return ResponseEntity.ok(personalInfoService.updatePersonalInfo(resumeId, personalInfo));
    }
    @DeleteMapping
    public ResponseEntity<Void> deletePersonalInfo(@PathVariable Long resumeId) {
        personalInfoService.deletePersonalInfo(resumeId); return ResponseEntity.noContent().build();
    }
}
