package com.sproutfund;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sproutfund.dto.UpdateInvestmentRequest;
import com.sproutfund.model.InvestmentRecommendation;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * The pin feature depends on the JSON property being exactly "isPinned" —
 * that is what the client sends and what it reads back. Jackson's bean naming
 * would otherwise expose a boolean getter isPinned() as "pinned", which would
 * silently break pinning in the UI without any error.
 */
class InvestmentPinJsonTest {

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void serializesPinnedAsIsPinned() throws Exception {
        InvestmentRecommendation rec = new InvestmentRecommendation();
        rec.setPinned(true);

        String json = mapper.writeValueAsString(rec);

        assertTrue(json.contains("\"isPinned\":true"), "expected isPinned in JSON but got: " + json);
        assertTrue(!json.contains("\"pinned\""), "should not also expose a 'pinned' property: " + json);
    }

    @Test
    void deserializesIsPinnedFromClient() throws Exception {
        UpdateInvestmentRequest request =
            mapper.readValue("{\"isPinned\":true}", UpdateInvestmentRequest.class);

        assertEquals(Boolean.TRUE, request.getIsPinned());
        // A pin request carries no title; it must stay null so the handler
        // leaves the existing name alone instead of blanking it.
        assertNull(request.getTitle(), "title must be null when the client only sends isPinned");
    }

    @Test
    void deserializesRenameWithoutTouchingPin() throws Exception {
        UpdateInvestmentRequest request =
            mapper.readValue("{\"title\":\"Retirement\"}", UpdateInvestmentRequest.class);

        assertEquals("Retirement", request.getTitle());
        assertNull(request.getIsPinned(), "isPinned must be null when the client only sends a title");
    }
}
