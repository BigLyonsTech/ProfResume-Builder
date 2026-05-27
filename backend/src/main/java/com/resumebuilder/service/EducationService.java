package com.resumebuilder.service;

import com.resumebuilder.exception.ResourceNotFoundException;
import com.resumebuilder.exception.ValidationException;
import com.resumebuilder.model.Education;
import com.resumebuilder.model.Resume;
import com.resumebuilder.repository.EducationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Year;
import java.util.List;

@Service
public class EducationService {

    private static final Logger log = LoggerFactory.getLogger(EducationService.class);
    private final EducationRepository educationRepository;
    private final ResumeService resumeService;

    public EducationService(EducationRepository educationRepository, ResumeService resumeService) {
        this.educationRepository = educationRepository;
        this.resumeService = resumeService;
    }

    @Transactional
    public Education createEducation(Long resumeId, Education education) {
        Resume resume = resumeService.getResumeById(resumeId);
        validateEducation(education);
        education.setResume(resume);
        return educationRepository.save(education);
    }

    @Transactional(readOnly = true)
    public List<Education> getEducationsByResumeId(Long resumeId) {
        resumeService.getResumeById(resumeId);
        return educationRepository.findByResumeIdOrderByStartYearDesc(resumeId);
    }

    @Transactional(readOnly = true)
    public Education getEducationById(Long id) {
        return educationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education", "id", id));
    }

    @Transactional
    public Education updateEducation(Long id, Education updated) {
        Education existing = getEducationById(id);
        validateEducation(updated);
        existing.setSchool(updated.getSchool());
        existing.setDegree(updated.getDegree());
        existing.setFieldOfStudy(updated.getFieldOfStudy());
        existing.setStartYear(updated.getStartYear());
        existing.setEndYear(updated.getEndYear());
        existing.setGpa(updated.getGpa());
        existing.setCurrentlyStudying(updated.isCurrentlyStudying());
        return educationRepository.save(existing);
    }

    @Transactional
    public void deleteEducation(Long id) { educationRepository.delete(getEducationById(id)); }

    private void validateEducation(Education e) {
        int currentYear = Year.now().getValue();
        if (e.getStartYear() > currentYear)
            throw new ValidationException("Start year cannot be in the future");
        if (!e.isCurrentlyStudying() && e.getEndYear() == null)
            throw new ValidationException("End year is required, or set 'currentlyStudying' to true.");
        if (e.getEndYear() != null && e.getEndYear() < e.getStartYear())
            throw new ValidationException("End year cannot be before start year");
        if (e.isCurrentlyStudying() && e.getEndYear() != null)
            throw new ValidationException("End year should not be set when 'currentlyStudying' is true");
        if (e.getGpa() != null && (e.getGpa() < 0.0 || e.getGpa() > 4.0))
            throw new ValidationException("GPA must be between 0.0 and 4.0");
    }
}
