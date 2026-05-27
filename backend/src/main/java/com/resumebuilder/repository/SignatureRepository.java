package com.resumebuilder.repository;

import com.resumebuilder.model.Signature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SignatureRepository extends JpaRepository<Signature, Long> {
    Optional<Signature> findByResumeId(Long resumeId);
    boolean existsByResumeId(Long resumeId);
}
