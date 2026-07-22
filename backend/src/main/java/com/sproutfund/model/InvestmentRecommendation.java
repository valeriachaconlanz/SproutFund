package com.sproutfund.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

// A saved investment plan. Row is only written when the user explicitly
// hits "Save" on the results page — generating a plan doesn't persist it.
@Entity
@Table(name = "investment_recommendations")
public class InvestmentRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Supabase auth.users.id (from the verified JWT's "sub" claim) — this
    // app never reads/writes auth.users or profiles directly.
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private double budget;

    @Column(nullable = false)
    private String timeline;

    @Column(name = "risk_tolerance", nullable = false)
    private String riskTolerance;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private List<InvestmentStrategy> strategies;

    private String disclaimer;

    // User-assigned label, set later via rename — blank until then.
    private String title;

    // Pinned plans sort to the top of Saved Plans. Defaults to false so rows
    // that pre-date this column behave as unpinned.
    @Column(name = "is_pinned", nullable = false)
    private boolean isPinned = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public InvestmentRecommendation() {}

    public InvestmentRecommendation(UUID userId, double budget, String timeline, String riskTolerance,
                                     List<InvestmentStrategy> strategies, String disclaimer) {
        this.userId = userId;
        this.budget = budget;
        this.timeline = timeline;
        this.riskTolerance = riskTolerance;
        this.strategies = strategies;
        this.disclaimer = disclaimer;
    }

    public Long getId() { return id; }
    public UUID getUserId() { return userId; }
    public double getBudget() { return budget; }
    public String getTimeline() { return timeline; }
    public String getRiskTolerance() { return riskTolerance; }
    public List<InvestmentStrategy> getStrategies() { return strategies; }
    public String getDisclaimer() { return disclaimer; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    // Explicitly named so the JSON stays "isPinned" — Jackson's bean naming
    // would otherwise expose a boolean getter isPinned() as "pinned", which
    // is not what the client sends or reads.
    @JsonProperty("isPinned")
    public boolean isPinned() { return isPinned; }

    @JsonProperty("isPinned")
    public void setPinned(boolean pinned) { this.isPinned = pinned; }

    public Instant getCreatedAt() { return createdAt; }
}
