package com.resumebuilder.service;

import com.resumebuilder.exception.ResourceNotFoundException;
import com.resumebuilder.exception.ValidationException;
import com.resumebuilder.model.Resume;
import com.resumebuilder.model.Signature;
import com.resumebuilder.model.SignatureType;
import com.resumebuilder.repository.SignatureRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
public class SignatureService {

    private static final Logger log = LoggerFactory.getLogger(SignatureService.class);
    private final SignatureRepository signatureRepository;
    private final ResumeService resumeService;

    public SignatureService(SignatureRepository signatureRepository, ResumeService resumeService) {
        this.signatureRepository = signatureRepository;
        this.resumeService = resumeService;
    }

    @Transactional
    public Signature createSignature(Long resumeId, Signature signature) {
        Resume resume = resumeService.getResumeById(resumeId);
        if (signatureRepository.existsByResumeId(resumeId))
            throw new ValidationException("Resume " + resumeId + " already has a signature. Use PUT to update.");
        validateSignature(signature);
        if (signature.isShowDate() && (signature.getDateLabel() == null || signature.getDateLabel().isBlank()))
            signature.setDateLabel(LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
        signature.setResume(resume);
        return signatureRepository.save(signature);
    }

    @Transactional(readOnly = true)
    public Signature getSignatureByResumeId(Long resumeId) {
        return signatureRepository.findByResumeId(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Signature", "resumeId", resumeId));
    }

    @Transactional
    public Signature updateSignature(Long resumeId, Signature updated) {
        Signature existing = getSignatureByResumeId(resumeId);
        validateSignature(updated);
        if (updated.isShowDate() && (updated.getDateLabel() == null || updated.getDateLabel().isBlank()))
            existing.setDateLabel(LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
        else
            existing.setDateLabel(updated.getDateLabel());
        existing.setSignatureType(updated.getSignatureType());
        existing.setSignatoryName(updated.getSignatoryName());
        existing.setImageData(updated.getImageData());
        existing.setShowDate(updated.isShowDate());
        return signatureRepository.save(existing);
    }

    @Transactional
    public void deleteSignature(Long resumeId) {
        signatureRepository.delete(getSignatureByResumeId(resumeId));
    }

    private void validateSignature(Signature sig) {
        if (sig.getSignatureType() == SignatureType.TYPED) {
            if (sig.getSignatoryName() == null || sig.getSignatoryName().isBlank())
                throw new ValidationException("Signatory name is required for a TYPED signature.");
            if (sig.getImageData() != null && !sig.getImageData().isBlank())
                throw new ValidationException("Image data should not be provided for a TYPED signature.");
        } else if (sig.getSignatureType() == SignatureType.IMAGE) {
            if (sig.getImageData() == null || sig.getImageData().isBlank())
                throw new ValidationException("Image data is required for an IMAGE signature.");
            validateBase64Image(sig.getImageData());
        }
    }

    private void validateBase64Image(String imageData) {
        try {
            String base64;
            if (imageData.startsWith("data:image")) {
                String[] parts = imageData.split(",", 2);
                if (parts.length < 2) throw new ValidationException("Invalid image format.");
                String mime = parts[0].toLowerCase();
                if (!mime.contains("image/png") && !mime.contains("image/jpeg"))
                    throw new ValidationException("Only PNG and JPG signature images are supported.");
                base64 = parts[1];
            } else {
                base64 = imageData;
            }
            Base64.getDecoder().decode(base64);
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid Base64 image data. Provide a valid PNG or JPG.");
        }
    }
}
