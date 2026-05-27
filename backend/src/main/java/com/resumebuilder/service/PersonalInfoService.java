package com.resumebuilder.service;

import com.resumebuilder.exception.DuplicateResourceException;
import com.resumebuilder.exception.ResourceNotFoundException;
import com.resumebuilder.exception.ValidationException;
import com.resumebuilder.model.PersonalInfo;
import com.resumebuilder.model.Resume;
import com.resumebuilder.repository.PersonalInfoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PersonalInfoService {

    private static final Logger log = LoggerFactory.getLogger(PersonalInfoService.class);
    private final PersonalInfoRepository personalInfoRepository;
    private final ResumeService resumeService;

    public PersonalInfoService(PersonalInfoRepository personalInfoRepository, ResumeService resumeService) {
        this.personalInfoRepository = personalInfoRepository;
        this.resumeService = resumeService;
    }

    @Transactional
    public PersonalInfo createPersonalInfo(Long resumeId, PersonalInfo personalInfo) {
        Resume resume = resumeService.getResumeById(resumeId);
        if (personalInfoRepository.findByResumeId(resumeId).isPresent())
            throw new ValidationException("Resume " + resumeId + " already has personal info. Use PUT to update.");
        validateEmailUniqueness(personalInfo.getEmail(), null);
        validateUrls(personalInfo);
        personalInfo.setResume(resume);
        return personalInfoRepository.save(personalInfo);
    }

    @Transactional(readOnly = true)
    public PersonalInfo getPersonalInfoByResumeId(Long resumeId) {
        return personalInfoRepository.findByResumeId(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("PersonalInfo", "resumeId", resumeId));
    }

    @Transactional
    public PersonalInfo updatePersonalInfo(Long resumeId, PersonalInfo updatedInfo) {
        PersonalInfo existing = getPersonalInfoByResumeId(resumeId);
        if (!existing.getEmail().equalsIgnoreCase(updatedInfo.getEmail()))
            validateEmailUniqueness(updatedInfo.getEmail(), existing.getId());
        validateUrls(updatedInfo);
        existing.setFullName(updatedInfo.getFullName());
        existing.setEmail(updatedInfo.getEmail());
        existing.setPhone(updatedInfo.getPhone());
        existing.setAddress(updatedInfo.getAddress());
        existing.setSummary(updatedInfo.getSummary());
        existing.setLinkedIn(updatedInfo.getLinkedIn());
        existing.setGithub(updatedInfo.getGithub());
        existing.setPortfolio(updatedInfo.getPortfolio());
        return personalInfoRepository.save(existing);
    }

    @Transactional
    public void deletePersonalInfo(Long resumeId) {
        personalInfoRepository.delete(getPersonalInfoByResumeId(resumeId));
    }

    private void validateEmailUniqueness(String email, Long excludeId) {
        if (personalInfoRepository.existsByEmail(email) && excludeId == null)
            throw new DuplicateResourceException("Email", email);
    }

    private void validateUrls(PersonalInfo info) {
        if (info.getLinkedIn() != null && !info.getLinkedIn().isBlank()
                && !info.getLinkedIn().toLowerCase().contains("linkedin.com"))
            throw new ValidationException("LinkedIn URL must be a valid LinkedIn profile link");
        if (info.getGithub() != null && !info.getGithub().isBlank()
                && !info.getGithub().toLowerCase().contains("github.com"))
            throw new ValidationException("GitHub URL must be a valid GitHub profile link");
        if (info.getPortfolio() != null && !info.getPortfolio().isBlank()
                && !info.getPortfolio().matches("^(https?://).*$"))
            throw new ValidationException("Portfolio URL must start with http:// or https://");
    }
}
