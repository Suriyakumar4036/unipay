package com.globalpay.api.service;

import com.globalpay.api.dto.TransferRequest;
import com.globalpay.api.dto.TransferResponse;
import com.globalpay.api.entity.CurrencyRate;
import com.globalpay.api.entity.Transaction;
import com.globalpay.api.entity.User;
import com.globalpay.api.entity.Wallet;
import com.globalpay.api.repository.CurrencyRateRepository;
import com.globalpay.api.repository.TransactionRepository;
import com.globalpay.api.repository.UserRepository;
import com.globalpay.api.repository.WalletRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class TransferService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final CurrencyRateRepository currencyRateRepository;

    private static final BigDecimal PLATFORM_FEE_PERCENTAGE = new BigDecimal("0.015"); // 1.5% fee

    public TransferService(UserRepository userRepository, WalletRepository walletRepository,
                           TransactionRepository transactionRepository, CurrencyRateRepository currencyRateRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.currencyRateRepository = currencyRateRepository;
    }

    public TransferResponse sendMoney(TransferRequest request) {
        String senderGlobalId = SecurityContextHolder.getContext().getAuthentication().getName();
        
        User sender = userRepository.findByGlobalId(senderGlobalId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findByGlobalId(request.getReceiverGlobalId())
                .orElseThrow(() -> new RuntimeException("Receiver global ID not found"));

        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException("Cannot send money to yourself");
        }

        Wallet senderWallet = walletRepository.findByUserIdAndCurrency(sender.getId(), request.getCurrency())
                .orElseThrow(() -> new RuntimeException("Sender does not have a wallet in " + request.getCurrency()));

        BigDecimal amountToSend = request.getAmount();
        BigDecimal platformFee = amountToSend.multiply(PLATFORM_FEE_PERCENTAGE).setScale(4, RoundingMode.HALF_UP);
        BigDecimal totalDeduction = amountToSend.add(platformFee);

        if (senderWallet.getBalance().compareTo(totalDeduction) < 0) {
            throw new RuntimeException("Insufficient balance in " + request.getCurrency() + " wallet. Required: " + totalDeduction + " (including 1.5% fee)");
        }

        // Determine receiver's primary currency (For simplicity, defaulting to USD if multiple exist, or just picking their first wallet)
        Wallet receiverWallet = walletRepository.findByUserId(receiver.getId()).stream()
                .filter(w -> w.getCurrency().equals("USD")).findFirst()
                .orElseGet(() -> walletRepository.findByUserId(receiver.getId()).get(0));

        BigDecimal exchangeRate = BigDecimal.ONE;
        if (!senderWallet.getCurrency().equals(receiverWallet.getCurrency())) {
            CurrencyRate rateEntity = currencyRateRepository.findByFromCurrencyAndToCurrency(senderWallet.getCurrency(), receiverWallet.getCurrency())
                    .orElseThrow(() -> new RuntimeException("Exchange rate not found for " + senderWallet.getCurrency() + " to " + receiverWallet.getCurrency()));
            exchangeRate = rateEntity.getRate();
        }

        BigDecimal amountReceived = amountToSend.multiply(exchangeRate).setScale(4, RoundingMode.HALF_UP);

        // Deduct from sender
        senderWallet.setBalance(senderWallet.getBalance().subtract(totalDeduction));
        walletRepository.save(senderWallet);

        // Credit to receiver
        receiverWallet.setBalance(receiverWallet.getBalance().add(amountReceived));
        walletRepository.save(receiverWallet);

        // Record Transaction
        Transaction tx = new Transaction();
        tx.setSender(sender);
        tx.setReceiver(receiver);
        tx.setAmountSent(amountToSend);
        tx.setSenderCurrency(senderWallet.getCurrency());
        tx.setAmountReceived(amountReceived);
        tx.setReceiverCurrency(receiverWallet.getCurrency());
        tx.setExchangeRate(exchangeRate);
        tx.setPlatformFee(platformFee);
        tx.setStatus("SUCCESS");
        Transaction savedTx = transactionRepository.save(tx);

        return TransferResponse.builder()
                .transactionId(savedTx.getId())
                .status("SUCCESS")
                .amountSent(amountToSend)
                .senderCurrency(senderWallet.getCurrency())
                .amountReceived(amountReceived)
                .receiverCurrency(receiverWallet.getCurrency())
                .exchangeRate(exchangeRate)
                .platformFee(platformFee)
                .message("Transfer successful to " + receiver.getName())
                .timestamp(savedTx.getTimestamp())
                .build();
    }
}
