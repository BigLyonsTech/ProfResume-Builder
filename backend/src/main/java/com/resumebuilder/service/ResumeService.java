package com.resumebuilder.service;

import com.resumebuilder.exception.ResourceNotFoundException;
import com.resumebuilder.exception.ValidationException;
import com.resumebuilder.model.Resume;
import com.resumebuilder.repository.ResumeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ResumeService {

    private static final Logger log = LoggerFactory.getLogger(ResumeService.class);
    private final ResumeRepository resumeRepository;

    public ResumeService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    @Transactional
    public Resume createResume(Resume resume) {
        validateResumeTitle(resume.getTitle());
        Resume saved = resumeRepository.save(resume);
        log.info("Resume created with ID: {}", saved.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Resume> getAllResumes() { return resumeRepository.findAll(); }

    @Transactional(readOnly = true)
    public Resume getResumeById(Long id) {
        return resumeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "id", id));
    }

    @Transactional(readOnly = true)
    public List<Resume> searchByTitle(String keyword) {
        return resumeRepository.findByTitleContainingIgnoreCase(keyword);
    }

    @Transactional
    public Resume updateResume(Long id, Resume updatedResume) {
        Resume existing = getResumeById(id);
        validateResumeTitle(updatedResume.getTitle());
        existing.setTitle(updatedResume.getTitle());
        return resumeRepository.save(existing);
    }

    @Transactional
    public void deleteResume(Long id) {
        resumeRepository.delete(getResumeById(id));
        log.info("Resume with ID {} deleted", id);
    }

    @Transactional(readOnly = true)
    public boolean resumeExists(Long id) { return resumeRepository.existsById(id); }

    private void validateResumeTitle(String title) {
        if (title == null || title.trim().isEmpty())
            throw new ValidationException("Resume title must not be empty");
        if (title.trim().length() < 2)
            throw new ValidationException("Resume title must be at least 2 characters");
        if (title.length() > 100)
            throw new ValidationException("Resume title must not exceed 100 characters");
    }
}
