package com.sproutfund.config;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClaudeConfig {

    @Value("${anthropic.api-key:}")
    private String apiKey;

    @Bean
    public AnthropicClient anthropicClient() {
        if (apiKey != null && !apiKey.isBlank()) {
            return AnthropicOkHttpClient.builder().apiKey(apiKey).build();
        }
        // Falls back to ANTHROPIC_API_KEY environment variable
        return AnthropicOkHttpClient.fromEnv();
    }
}
