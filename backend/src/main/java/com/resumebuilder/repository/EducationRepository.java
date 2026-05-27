package com.resumebuilder.repository;

import com.resumebuilder.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByResumeId(Long resumeId);
    List<Education> findByResumeIdOrderByStartYearDesc(Long resumeId);
}
