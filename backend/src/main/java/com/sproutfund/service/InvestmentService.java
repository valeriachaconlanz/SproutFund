package com.sproutfund.service;

import com.sproutfund.model.InvestmentRequest;
import com.sproutfund.model.InvestmentResponse;
import org.springframework.stereotype.Service;

@Service
public class InvestmentService {

    public InvestmentResponse buildRecommendation(InvestmentRequest request) {
        String recommendation = generateRecommendation(request.getBudget(), request.getTimeline());
        return new InvestmentResponse(request.getBudget(), request.getTimeline(), recommendation);
    }

    private String generateRecommendation(double budget, String timeline) {
        String tier = budget < 1000 ? "starter" : budget < 10000 ? "growing" : "established";

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
}
