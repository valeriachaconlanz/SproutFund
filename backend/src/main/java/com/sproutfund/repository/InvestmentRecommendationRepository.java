package com.sproutfund.repository;

import com.sproutfund.model.InvestmentRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InvestmentRecommendationRepository extends JpaRepository<InvestmentRecommendation, Long> {
    List<InvestmentRecommendation> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
