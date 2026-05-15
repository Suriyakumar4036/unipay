package com.globalpay.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransferResponse {
    private String transactionId;
    private String status;
    private BigDecimal amountSent;
    private String senderCurrency;
    private BigDecimal amountReceived;
    private String receiverCurrency;
    private BigDecimal exchangeRate;
    private BigDecimal platformFee;
    private String message;
    private LocalDateTime timestamp;

    public TransferResponse() {}

    // Builder pattern
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final TransferResponse r = new TransferResponse();
        public Builder transactionId(String v) { r.transactionId = v; return this; }
        public Builder status(String v) { r.status = v; return this; }
        public Builder amountSent(BigDecimal v) { r.amountSent = v; return this; }
        public Builder senderCurrency(String v) { r.senderCurrency = v; return this; }
        public Builder amountReceived(BigDecimal v) { r.amountReceived = v; return this; }
        public Builder receiverCurrency(String v) { r.receiverCurrency = v; return this; }
        public Builder exchangeRate(BigDecimal v) { r.exchangeRate = v; return this; }
        public Builder platformFee(BigDecimal v) { r.platformFee = v; return this; }
        public Builder message(String v) { r.message = v; return this; }
        public Builder timestamp(LocalDateTime v) { r.timestamp = v; return this; }
        public TransferResponse build() { return r; }
    }

    public String getTransactionId() { return transactionId; }
    public String getStatus() { return status; }
    public BigDecimal getAmountSent() { return amountSent; }
    public String getSenderCurrency() { return senderCurrency; }
    public BigDecimal getAmountReceived() { return amountReceived; }
    public String getReceiverCurrency() { return receiverCurrency; }
    public BigDecimal getExchangeRate() { return exchangeRate; }
    public BigDecimal getPlatformFee() { return platformFee; }
    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
