package com.resumebuilder.service;

import com.resumebuilder.exception.ResourceNotFoundException;
import com.resumebuilder.exception.ValidationException;
import com.resumebuilder.model.ProficiencyLevel;
import com.resumebuilder.model.Resume;
import com.resumebuilder.model.Skill;
import com.resumebuilder.repository.SkillRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class SkillService {

    private static final Logger log = LoggerFactory.getLogger(SkillService.class);
    private final SkillRepository skillRepository;
    private final ResumeService resumeService;

    public SkillService(SkillRepository skillRepository, ResumeService resumeService) {
        this.skillRepository = skillRepository;
        this.resumeService = resumeService;
    }

    @Transactional
    public Skill createSkill(Long resumeId, Skill skill) {
        Resume resume = resumeService.getResumeById(resumeId);
        validateSkill(resumeId, skill, null);
        skill.setName(normalizeName(skill.getName()));
        skill.setResume(resume);
        return skillRepository.save(skill);
    }

    @Transactional(readOnly = true)
    public List<Skill> getSkillsByResumeId(Long resumeId) {
        resumeService.getResumeById(resumeId);
        return skillRepository.findByResumeId(resumeId);
    }

    @Transactional(readOnly = true)
    public List<Skill> getSkillsByLevel(Long resumeId, ProficiencyLevel level) {
        resumeService.getResumeById(resumeId);
        return skillRepository.findByResumeIdAndProficiencyLevel(resumeId, level);
    }

    @Transactional(readOnly = true)
    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));
    }

    @Transactional
    public Skill updateSkill(Long id, Skill updated) {
        Skill existing = getSkillById(id);
        validateSkill(existing.getResume().getId(), updated, id);
        existing.setName(normalizeName(updated.getName()));
        existing.setProficiencyLevel(updated.getProficiencyLevel());
        return skillRepository.save(existing);
    }

    @Transactional
    public void deleteSkill(Long id) { skillRepository.delete(getSkillById(id)); }

    private void validateSkill(Long resumeId, Skill skill, Long excludeId) {
        if (skill.getName() == null || skill.getName().trim().isEmpty())
            throw new ValidationException("Skill name must not be blank");
        if (skill.getProficiencyLevel() == null)
            throw new ValidationException("Proficiency level is required: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT");
        String normalized = normalizeName(skill.getName());
        boolean isDuplicate = skillRepository.findByResumeId(resumeId).stream()
                .filter(s -> excludeId == null || !s.getId().equals(excludeId))
                .anyMatch(s -> s.getName().equalsIgnoreCase(normalized));
        if (isDuplicate)
            throw new ValidationException("Skill '" + normalized + "' already exists on this resume.");
    }

    private String normalizeName(String name) {
        if (name == null) return null;
        String trimmed = name.trim();
        if (trimmed.isEmpty()) return trimmed;
        String[] words = trimmed.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String word : words) {
            if (!sb.isEmpty()) sb.append(" ");
            sb.append(Character.toUpperCase(word.charAt(0)));
            if (word.length() > 1) sb.append(word.substring(1).toLowerCase());
        }
        return sb.toString();
    }
}
