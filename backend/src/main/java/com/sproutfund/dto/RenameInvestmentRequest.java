package com.sproutfund.dto;

public class RenameInvestmentRequest {

    private String title;
    private Boolean isPinned;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Boolean getIsPinned() { return isPinned; } // Added getter
    public void setIsPinned(Boolean isPinned) { this.isPinned = isPinned; }
}