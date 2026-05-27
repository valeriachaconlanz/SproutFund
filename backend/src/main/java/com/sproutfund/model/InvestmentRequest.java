package com.sproutfund.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class InvestmentRequest {

    @Positive(message = "Budget must be a positive number.")
    private double budget;

    @NotBlank(message = "Timeline must be selected.")
    private String timeline;

    @NotBlank(message = "Risk tolerance must be selected.")
    private String riskTolerance;

    public double getBudget() { return budget; }
    public void setBudget(double budget) { this.budget = budget; }

    public String getTimeline() { return timeline; }
    public void setTimeline(String timeline) { this.timeline = timeline; }

    public String getRiskTolerance() { return riskTolerance; }
    public void setRiskTolerance(String riskTolerance) { this.riskTolerance = riskTolerance; }

}
