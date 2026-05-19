package com.sproutfund.controller;

import com.sproutfund.model.InvestmentRequest;
import com.sproutfund.model.InvestmentResponse;
import com.sproutfund.service.InvestmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/investment")
@CrossOrigin(origins = "http://localhost:5173")
public class InvestmentController {

    private final InvestmentService investmentService;

    public InvestmentController(InvestmentService investmentService) {
        this.investmentService = investmentService;
    }

    @PostMapping
    public ResponseEntity<InvestmentResponse> submitInvestment(@Valid @RequestBody InvestmentRequest request) {
        InvestmentResponse response = investmentService.buildRecommendation(request);
        return ResponseEntity.ok(response);
    }
}
