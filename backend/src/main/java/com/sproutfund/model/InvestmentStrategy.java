package com.sproutfund.model;

import java.util.List;

public class InvestmentStrategy {

    private String name;
    private int allocation;
    private String description;
    private List<String> vehicles;
    private String platform;

    public InvestmentStrategy() {}

    public InvestmentStrategy(String name, int allocation, String description, List<String> vehicles, String platform) {
        this.name = name;
        this.allocation = allocation;
        this.description = description;
        this.vehicles = vehicles;
        this.platform = platform;
    }

    public String getName() { return name; }
    public int getAllocation() { return allocation; }
    public String getDescription() { return description; }
    public List<String> getVehicles() { return vehicles; }
    public String getPlatform() { return platform; }
}
