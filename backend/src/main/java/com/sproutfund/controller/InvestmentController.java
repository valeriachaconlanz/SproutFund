package com.sproutfund.controller;

import com.sproutfund.dto.RenameInvestmentRequest;
import com.sproutfund.dto.SaveInvestmentRequest;
import com.sproutfund.model.InvestmentRecommendation;
import com.sproutfund.model.InvestmentRequest;
import com.sproutfund.model.InvestmentResponse;
import com.sproutfund.repository.InvestmentRecommendationRepository;
import com.sproutfund.service.InvestmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/investment")
@CrossOrigin(origins = "http://localhost:5173")
public class InvestmentController {

    private final InvestmentService investmentService;
    private final InvestmentRecommendationRepository recommendationRepository;

    public InvestmentController(InvestmentService investmentService,
                                 InvestmentRecommendationRepository recommendationRepository) {
        this.investmentService = investmentService;
        this.recommendationRepository = recommendationRepository;
    }

    @PostMapping
    public ResponseEntity<InvestmentResponse> submitInvestment(@Valid @RequestBody InvestmentRequest request) {
        InvestmentResponse response = investmentService.buildRecommendation(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/save")
    public ResponseEntity<InvestmentRecommendation> save(@Valid @RequestBody SaveInvestmentRequest request,
                                                         @AuthenticationPrincipal Jwt jwt) {
        InvestmentRecommendation recommendation = new InvestmentRecommendation(
                UUID.fromString(jwt.getSubject()),
                request.getBudget(),
                request.getTimeline(),
                request.getRiskTolerance(),
                request.getStrategies(),
                request.getDisclaimer()
        );

        recommendation.setTitle(request.getTitle());
        recommendation.setIsPinned(
            request.getIsPinned() != null ? request.getIsPinned() : false
        );
        
        return ResponseEntity.ok(recommendationRepository.save(recommendation));
    }

    @GetMapping("/history")
    public ResponseEntity<List<InvestmentRecommendation>> history(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<InvestmentRecommendation> rename(@PathVariable Long id,
                                                           @RequestBody RenameInvestmentRequest request,
                                                           @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return recommendationRepository.findByIdAndUserId(id, userId)
                .map(recommendation -> {
                    // Update the title if a new one was sent
                    if (request.getTitle() != null) {
                        recommendation.setTitle(request.getTitle());
                    }
                    
                    // Update the pinned status if it was sent
                    if (request.getIsPinned() != null) {
                        recommendation.setIsPinned(request.getIsPinned());
                    }
                    
                    return ResponseEntity.ok(recommendationRepository.save(recommendation));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return recommendationRepository.findByIdAndUserId(id, userId)
                .map(recommendation -> {
                    recommendationRepository.delete(recommendation);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}