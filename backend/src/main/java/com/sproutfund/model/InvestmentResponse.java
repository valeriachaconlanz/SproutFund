package com.sproutfund.model;

import java.util.List;

public class InvestmentResponse {

    private double budget;
    private String timeline;
    private String riskTolerance;
    private List<InvestmentStrategy> strategies;
    private String disclaimer;

    public InvestmentResponse(double budget, String timeline, String riskTolerance,
                               List<InvestmentStrategy> strategies, String disclaimer) {
        this.budget = budget;
        this.timeline = timeline;
        this.riskTolerance = riskTolerance;
        this.strategies = strategies;
        this.disclaimer = disclaimer;
    }

    public double getBudget() { return budget; }
    public String getTimeline() { return timeline; }
    public String getRiskTolerance() { return riskTolerance; }
    public List<InvestmentStrategy> getStrategies() { return strategies; }
    public String getDisclaimer() { return disclaimer; }
}
