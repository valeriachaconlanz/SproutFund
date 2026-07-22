package com.sproutfund.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

// Partial update for a saved plan (PATCH /api/investment/{id}).
//
// Both fields are wrapper types on purpose: null means "the client did not
// send this field", which is what lets the handler leave it untouched. Using
// primitives here would make an absent isPinned indistinguishable from false,
// and an absent title would blank the plan's name.
public class UpdateInvestmentRequest {

    private String title;

    @JsonProperty("isPinned")
    private Boolean isPinned;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    @JsonProperty("isPinned")
    public Boolean getIsPinned() { return isPinned; }

    @JsonProperty("isPinned")
    public void setIsPinned(Boolean isPinned) { this.isPinned = isPinned; }
}
