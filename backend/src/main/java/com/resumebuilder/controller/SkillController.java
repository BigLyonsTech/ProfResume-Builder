package com.resumebuilder.controller;

import com.resumebuilder.model.ProficiencyLevel;
import com.resumebuilder.model.Skill;
import com.resumebuilder.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resumes/{resumeId}/skills")
public class SkillController {
    private final SkillService skillService;
    public SkillController(SkillService skillService) { this.skillService = skillService; }

    @PostMapping
    public ResponseEntity<Skill> createSkill(@PathVariable Long resumeId, @Valid @RequestBody Skill skill) {
        return ResponseEntity.status(HttpStatus.CREATED).body(skillService.createSkill(resumeId, skill));
    }
    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills(@PathVariable Long resumeId, @RequestParam(required = false) ProficiencyLevel level) {
        if (level != null) return ResponseEntity.ok(skillService.getSkillsByLevel(resumeId, level));
        return ResponseEntity.ok(skillService.getSkillsByResumeId(resumeId));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Skill> getSkillById(@PathVariable Long resumeId, @PathVariable Long id) {
        return ResponseEntity.ok(skillService.getSkillById(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable Long resumeId, @PathVariable Long id, @Valid @RequestBody Skill skill) {
        return ResponseEntity.ok(skillService.updateSkill(id, skill));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long resumeId, @PathVariable Long id) {
        skillService.deleteSkill(id); return ResponseEntity.noContent().build();
    }
}
