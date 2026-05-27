package com.resumebuilder.repository;

import com.resumebuilder.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findByResumeId(Long resumeId);
    List<Experience> findByResumeIdOrderByStartDateDesc(Long resumeId);
    List<Experience> findByResumeIdAndCurrentlyWorkingTrue(Long resumeId);
}
