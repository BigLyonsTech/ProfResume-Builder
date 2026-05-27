package com.resumebuilder.service;

import com.resumebuilder.exception.ResourceNotFoundException;
import com.resumebuilder.exception.ValidationException;
import com.resumebuilder.model.Experience;
import com.resumebuilder.model.Resume;
import com.resumebuilder.repository.ExperienceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExperienceService {

    private static final Logger log = LoggerFactory.getLogger(ExperienceService.class);
    private final ExperienceRepository experienceRepository;
    private final ResumeService resumeService;

    public ExperienceService(ExperienceRepository experienceRepository, ResumeService resumeService) {
        this.experienceRepository = experienceRepository;
        this.resumeService = resumeService;
    }

    @Transactional
    public Experience createExperience(Long resumeId, Experience experience) {
        Resume resume = resumeService.getResumeById(resumeId);
        validateExperience(experience);
        experience.setResume(resume);
        return experienceRepository.save(experience);
    }

    @Transactional(readOnly = true)
    public List<Experience> getExperiencesByResumeId(Long resumeId) {
        resumeService.getResumeById(resumeId);
        return experienceRepository.findByResumeIdOrderByStartDateDesc(resumeId);
    }

    @Transactional(readOnly = true)
    public Experience getExperienceById(Long id) {
        return experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));
    }

    @Transactional(readOnly = true)
    public List<Experience> getCurrentJobs(Long resumeId) {
        resumeService.getResumeById(resumeId);
        return experienceRepository.findByResumeIdAndCurrentlyWorkingTrue(resumeId);
    }

    @Transactional
    public Experience updateExperience(Long id, Experience updated) {
        Experience existing = getExperienceById(id);
        validateExperience(updated);
        existing.setCompany(updated.getCompany());
        existing.setJobTitle(updated.getJobTitle());
        existing.setDescription(updated.getDescription());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        existing.setCurrentlyWorking(updated.isCurrentlyWorking());
        return experienceRepository.save(existing);
    }

    @Transactional
    public void deleteExperience(Long id) { experienceRepository.delete(getExperienceById(id)); }

    private void validateExperience(Experience e) {
        LocalDate today = LocalDate.now();
        if (e.getStartDate().isAfter(today))
            throw new ValidationException("Start date cannot be in the future");
        if (!e.isCurrentlyWorking() && e.getEndDate() == null)
            throw new ValidationException("End date is required, or set 'currentlyWorking' to true.");
        if (e.isCurrentlyWorking() && e.getEndDate() != null)
            throw new ValidationException("End date should not be set when 'currentlyWorking' is true.");
        if (e.getEndDate() != null) {
            if (e.getEndDate().isBefore(e.getStartDate()))
                throw new ValidationException("End date cannot be before start date");
            if (e.getEndDate().isAfter(today))
                throw new ValidationException("End date cannot be in the future");
        }
        if (e.getDescription() != null && e.getDescription().trim().length() < 20)
            throw new ValidationException("Job description must be at least 20 characters");
    }
}
