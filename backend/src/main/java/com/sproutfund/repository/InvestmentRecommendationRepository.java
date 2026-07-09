package com.sproutfund.repository;

import com.sproutfund.model.InvestmentRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvestmentRecommendationRepository extends JpaRepository<InvestmentRecommendation, Long> {
    List<InvestmentRecommendation> findByUserIdOrderByCreatedAtDesc(UUID userId);

    // Scoped by userId so a rename/delete can't touch another user's row.
    Optional<InvestmentRecommendation> findByIdAndUserId(Long id, UUID userId);
}
