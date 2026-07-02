package com.sproutfund.dto;

import com.sproutfund.model.InvestmentStrategy;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

import java.util.List;

// Mirrors InvestmentResponse — the frontend re-sends the generated plan
// as-is when the user clicks "Save".
public class SaveInvestmentRequest {

    @Positive(message = "Budget must be a positive number.")
    private double budget;

    @NotBlank(message = "Timeline must be selected.")
    private String timeline;

    @NotBlank(message = "Risk tolerance must be selected.")
    private String riskTolerance;

    @NotEmpty(message = "At least one strategy is required.")
    @Valid
    private List<InvestmentStrategy> strategies;

    private String disclaimer;

    public double getBudget() { return budget; }
    public void setBudget(double budget) { this.budget = budget; }

    public String getTimeline() { return timeline; }
    public void setTimeline(String timeline) { this.timeline = timeline; }

    public String getRiskTolerance() { return riskTolerance; }
    public void setRiskTolerance(String riskTolerance) { this.riskTolerance = riskTolerance; }

    public List<InvestmentStrategy> getStrategies() { return strategies; }
    public void setStrategies(List<InvestmentStrategy> strategies) { this.strategies = strategies; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
}
