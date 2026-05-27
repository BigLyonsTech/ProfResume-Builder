package com.resumebuilder.controller;

import com.resumebuilder.model.Signature;
import com.resumebuilder.service.SignatureService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resumes/{resumeId}/signature")
public class SignatureController {
    private final SignatureService signatureService;
    public SignatureController(SignatureService signatureService) { this.signatureService = signatureService; }

    @PostMapping
    public ResponseEntity<Signature> createSignature(@PathVariable Long resumeId, @Valid @RequestBody Signature signature) {
        return ResponseEntity.status(HttpStatus.CREATED).body(signatureService.createSignature(resumeId, signature));
    }
    @GetMapping
    public ResponseEntity<Signature> getSignature(@PathVariable Long resumeId) {
        return ResponseEntity.ok(signatureService.getSignatureByResumeId(resumeId));
    }
    @PutMapping
    public ResponseEntity<Signature> updateSignature(@PathVariable Long resumeId, @Valid @RequestBody Signature signature) {
        return ResponseEntity.ok(signatureService.updateSignature(resumeId, signature));
    }
    @DeleteMapping
    public ResponseEntity<Void> deleteSignature(@PathVariable Long resumeId) {
        signatureService.deleteSignature(resumeId); return ResponseEntity.noContent().build();
    }
}
