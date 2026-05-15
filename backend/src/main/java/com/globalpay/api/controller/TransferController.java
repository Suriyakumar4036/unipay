package com.globalpay.api.controller;

import com.globalpay.api.dto.TransferRequest;
import com.globalpay.api.dto.TransferResponse;
import com.globalpay.api.service.TransferService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/transfer")
public class TransferController {

    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @PostMapping("/send")
    public ResponseEntity<TransferResponse> sendMoney(@Valid @RequestBody TransferRequest request) {
        try {
            return ResponseEntity.ok(transferService.sendMoney(request));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(TransferResponse.builder()
                    .status("FAILED")
                    .message(ex.getMessage())
                    .build());
        }
    }
}
