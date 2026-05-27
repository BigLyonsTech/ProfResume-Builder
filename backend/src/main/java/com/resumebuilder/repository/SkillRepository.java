package com.resumebuilder.repository;

import com.resumebuilder.model.ProficiencyLevel;
import com.resumebuilder.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByResumeId(Long resumeId);
    List<Skill> findByResumeIdAndProficiencyLevel(Long resumeId, ProficiencyLevel level);
}
