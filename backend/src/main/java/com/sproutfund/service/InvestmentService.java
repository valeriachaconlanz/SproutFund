package com.sproutfund.service;

import com.sproutfund.model.InvestmentRequest;
import com.sproutfund.model.InvestmentResponse;
import org.springframework.stereotype.Service;

//Service layer responsible for building and generating personalized investment recommendation
//based on user input for budget, timeline, and risk tolerance
@Service
public class InvestmentService {

    //Main method that builds recommendation response (Bsse recommendation + risk tolerance)
    public InvestmentResponse buildRecommendation(InvestmentRequest request) {
        String recommendation = generateRecommendation(request.getBudget(), request.getTimeline());
        recommendation = adjustForRisk(recommendation, request.getRiskTolerance());
        return new InvestmentResponse(request.getBudget(), request.getTimeline(), recommendation);
    }

    //Generates a base recommendation using:
    //Budget Tier: starter, growing, established
    //Timeline: short, medium, long
    private String generateRecommendation(double budget, String timeline) {
        //Determines budget tier based on user budget
        String tier = budget < 1000 ? "starter" : budget < 10000 ? "growing" : "established";

        //Selects recommendation based on timeline and tier
        return switch (timeline.toLowerCase()) {
            case "short" -> switch (tier) {
                case "starter"     -> "With your budget, a high-yield savings account or short-term CD is your safest move. You'll earn 4–5% APY while keeping your money accessible within the year.";
                case "growing"     -> "At this level, consider splitting between a high-yield savings account and a money market fund. You'll maintain liquidity while earning competitive returns before your 1-year mark.";
                case "established" -> "A treasury bill ladder or short-term bond fund is appropriate here. You can lock in favorable rates on 3–12 month T-bills while keeping a portion liquid in a money market account.";
                default            -> "Consider high-yield savings or short-term CDs for your timeline.";
            };
            case "medium" -> switch (tier) {
                case "starter"     -> "Index funds are your best friend over 1–5 years. Even small, consistent contributions to an S&P 500 index fund can compound meaningfully. Look for platforms with no minimums like Fidelity or Schwab.";
                case "growing"     -> "A balanced ETF portfolio (e.g., 70% equities / 30% bonds) suits your medium-term horizon well. Consider a three-fund portfolio: total market, international, and bonds.";
                case "established" -> "With this budget and a 1–5 year window, a diversified portfolio across index funds, dividend ETFs, and a small bond allocation gives you growth potential with reasonable downside protection.";
                default            -> "A balanced index fund portfolio aligns with your medium-term goals.";
            };
            case "long" -> switch (tier) {
                case "starter"     -> "Consistency beats amount over 5+ years. Even $50/month into an S&P 500 index fund will compound significantly. Start a Roth IRA if you qualify — the tax-free growth is a massive long-term advantage.";
                case "growing"     -> "A growth-oriented portfolio (80–90% equities) is appropriate for your long horizon. Consider diversifying internationally and adding small-cap exposure alongside your core S&P 500 holdings.";
                case "established" -> "An aggressive, globally diversified equity portfolio maximizes long-term compounding. At this level, also consider REITs for real estate exposure and factor-based ETFs (value, momentum) for additional diversification.";
                default            -> "Growth-oriented equities and index funds are ideal for your long-term goals.";
            };
            default -> "Please consult a financial advisor to build a plan tailored to your goals.";
        };
    }

    //Adjusts base recommnendation based on user's risk tolerance
    //Risk Tolerance: low, medium, high
    private String adjustForRisk(String recommendation, String riskTolerance) {
        //Returns recommendation alone if no risk tolerance was applied
        if (riskTolerance == null) return recommendation;

        //Selects adjustment based on risk tolerance
        return switch(riskTolerance.toLowerCase()) {
            case "low" -> recommendation + " | Risk Adjustment: With a low-risk profile, your portfolio is adjusted toward stable assets like bonds, Treasury bills, and high-yield savings accounts to minimize volatility and protect your principal.";
            case "medium" -> recommendation + " | Risk Adjustment: With a moderate-risk profile, your portfolio is balanced between index funds, ETFs, and bonds to provide steady growth while managing volatility.";
            case "high" -> recommendation + " | Risk Adjustment: With a high-risk profile, your portfolio is weighted more heavily toward equities, growth ETFs, and emerging markets to maximize long-term returns despite higher volatility.";
            default -> recommendation + " | Risk Adjustment: A balanced allocation has been applied based on standard risk assumptions.";
        };
    }
}
