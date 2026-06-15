package com.sproutfund.model;

import java.util.List;

public class InvestmentResponse {

    private double budget;
    private String timeline;
    private List<InvestmentStrategy> strategies;
    private String disclaimer;

    public InvestmentResponse(double budget, String timeline, List<InvestmentStrategy> strategies, String disclaimer) {
        this.budget = budget;
        this.timeline = timeline;
        this.strategies = strategies;
        this.disclaimer = disclaimer;
    }

    public double getBudget() { return budget; }
    public String getTimeline() { return timeline; }
    public List<InvestmentStrategy> getStrategies() { return strategies; }
    public String getDisclaimer() { return disclaimer; }
}
