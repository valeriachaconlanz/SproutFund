package com.sproutfund.model;

public class InvestmentResponse {

    private double budget;
    private String timeline;
    private String recommendation;

    public InvestmentResponse(double budget, String timeline, String recommendation) {
        this.budget = budget;
        this.timeline = timeline;
        this.recommendation = recommendation;
    }

    public double getBudget() { return budget; }
    public String getTimeline() { return timeline; }
    public String getRecommendation() { return recommendation; }
}
