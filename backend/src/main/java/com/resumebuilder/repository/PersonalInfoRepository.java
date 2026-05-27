package com.resumebuilder.repository;

import com.resumebuilder.model.PersonalInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PersonalInfoRepository extends JpaRepository<PersonalInfo, Long> {
    Optional<PersonalInfo> findByResumeId(Long resumeId);
    boolean existsByEmail(String email);
}
