package com.resumebuilder.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "signatures")
public class Signature {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonBackReference("resume-signature")
    private Resume resume;

    @NotNull(message = "Signature type is required (TYPED or IMAGE)")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SignatureType signatureType;

    @Size(min = 2, max = 100, message = "Signatory name must be between 2 and 100 characters")
    @Pattern(regexp = "^$|^[a-zA-Z\\s''\\-]+$",
             message = "Signatory name must contain letters only")
    private String signatoryName;

    @Column(columnDefinition = "TEXT")
    private String imageData;

    @Size(max = 50, message = "Date label must not exceed 50 characters")
    private String dateLabel;

    @Column(nullable = false)
    private boolean showDate = true;

    public Signature() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    public SignatureType getSignatureType() { return signatureType; }
    public void setSignatureType(SignatureType signatureType) { this.signatureType = signatureType; }
    public String getSignatoryName() { return signatoryName; }
    public void setSignatoryName(String signatoryName) { this.signatoryName = signatoryName; }
    public String getImageData() { return imageData; }
    public void setImageData(String imageData) { this.imageData = imageData; }
    public String getDateLabel() { return dateLabel; }
    public void setDateLabel(String dateLabel) { this.dateLabel = dateLabel; }
    public boolean isShowDate() { return showDate; }
    public void setShowDate(boolean showDate) { this.showDate = showDate; }
}
