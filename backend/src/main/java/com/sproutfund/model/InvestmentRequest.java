package com.sproutfund.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class InvestmentRequest {

    @Positive(message = "Budget must be a positive number.")
    private double budget;

    @NotBlank(message = "Timeline must be selected.")
    private String timeline;

    public double getBudget() { return budget; }
    public void setBudget(double budget) { this.budget = budget; }

    public String getTimeline() { return timeline; }
    public void setTimeline(String timeline) { this.timeline = timeline; }
}
