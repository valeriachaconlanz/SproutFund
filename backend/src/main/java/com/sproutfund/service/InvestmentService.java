package com.sproutfund.service;

import com.anthropic.client.AnthropicClient;
import com.anthropic.errors.AnthropicException;
import com.anthropic.errors.AnthropicServiceException;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sproutfund.model.InvestmentRequest;
import com.sproutfund.model.InvestmentResponse;
import com.sproutfund.model.InvestmentStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InvestmentService {

    private static final Logger log = LoggerFactory.getLogger(InvestmentService.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String SYSTEM_PROMPT =
        "You are a knowledgeable financial advisor helping everyday investors make smart decisions. " +
        "Respond ONLY with a valid JSON object — no markdown, no code fences, no extra text before or after. " +
        "Use this exact structure:\n" +
        "{\n" +
        "  \"strategies\": [\n" +
        "    {\n" +
        "      \"name\": \"Strategy name (2-4 words)\",\n" +
        "      \"allocation\": 50,\n" +
        "      \"description\": \"2-3 sentence explanation tailored to the user's budget, timeline, and risk tolerance.\",\n" +
        "      \"vehicles\": [\"Specific ETF or account name\", \"Another option\"],\n" +
        "      \"platform\": \"Where to open or buy this (e.g. Fidelity, Schwab, Coinbase)\"\n" +
        "    }\n" +
        "  ],\n" +
        "  \"disclaimer\": \"One sentence reminder to consult a licensed financial advisor.\"\n" +
        "}\n" +
        "Rules: provide 2-3 strategies, allocations must sum to exactly 100, always name real specific funds or account types.";

    private final AnthropicClient claude;

    public InvestmentService(AnthropicClient claude) {
        this.claude = claude;
    }

    public InvestmentResponse buildRecommendation(InvestmentRequest request) {
        return callClaude(request.getBudget(), request.getTimeline(), request.getRiskTolerance());
    }

    private InvestmentResponse callClaude(double budget, String timeline, String riskTolerance) {
        String userPrompt = String.format(
            "Budget: $%.0f | Timeline: %s (%s) | Risk tolerance: %s. Provide 2-3 personalized investment strategies.",
            budget,
            timeline,
            timelineDescription(timeline),
            riskTolerance
        );

        MessageCreateParams params = MessageCreateParams.builder()
            .model(Model.CLAUDE_SONNET_4_6)
            .maxTokens(1024L)
            .systemOfTextBlockParams(List.of(
                TextBlockParam.builder()
                    .text(SYSTEM_PROMPT)
                    .cacheControl(CacheControlEphemeral.builder().build())
                    .build()
            ))
            .addUserMessage(userPrompt)
            .build();

        try {
            String json = claude.messages().create(params)
                .content().stream()
                .flatMap(block -> block.text().stream())
                .findFirst()
                .map(tb -> tb.text())
                .orElse(null);

            if (json == null) return fallbackResponse(budget, timeline);

            JsonNode root = objectMapper.readTree(json);
            List<InvestmentStrategy> strategies = new ArrayList<>();
            for (JsonNode s : root.get("strategies")) {
                List<String> vehicles = new ArrayList<>();
                for (JsonNode v : s.get("vehicles")) {
                    vehicles.add(v.asText());
                }
                strategies.add(new InvestmentStrategy(
                    s.get("name").asText(),
                    s.get("allocation").asInt(),
                    s.get("description").asText(),
                    vehicles,
                    s.get("platform").asText()
                ));
            }
            String disclaimer = root.get("disclaimer").asText();
            return new InvestmentResponse(budget, timeline, strategies, disclaimer);

        } catch (AnthropicServiceException e) {
            log.error("Claude API error (HTTP {}): {}", e.statusCode(), e.getMessage());
            return fallbackResponse(budget, timeline);
        } catch (AnthropicException e) {
            log.error("Claude client error: {}", e.getMessage());
            return fallbackResponse(budget, timeline);
        } catch (Exception e) {
            log.error("Failed to parse Claude response: {}", e.getMessage());
            return fallbackResponse(budget, timeline);
        }
    }

    private InvestmentResponse fallbackResponse(double budget, String timeline) {
        return new InvestmentResponse(budget, timeline,
            List.of(new InvestmentStrategy(
                "Service Unavailable",
                100,
                "Our advisor is temporarily unavailable. Please try again shortly.",
                List.of(),
                ""
            )),
            ""
        );
    }

    private String timelineDescription(String timeline) {
        return switch (timeline.toLowerCase()) {
            case "short"  -> "under 1 year";
            case "medium" -> "1–5 years";
            case "long"   -> "5+ years";
            default       -> timeline;
        };
    }
}
