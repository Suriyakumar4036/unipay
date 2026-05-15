package com.globalpay.api.controller;

import com.globalpay.api.dto.WalletResponse;
import com.globalpay.api.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/wallet")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping("/balance")
    public ResponseEntity<List<WalletResponse>> getBalances() {
        return ResponseEntity.ok(walletService.getCurrentUserWallets());
    }
}
