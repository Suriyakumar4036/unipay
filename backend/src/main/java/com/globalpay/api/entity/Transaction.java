package com.globalpay.api.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;

    @DBRef
    private User sender;

    @DBRef
    private User receiver;

    private BigDecimal amountSent;
    private String senderCurrency;
    private BigDecimal amountReceived;
    private String receiverCurrency;
    private BigDecimal exchangeRate;
    private BigDecimal platformFee;
    private String status;
    private String failureReason;
    private LocalDateTime timestamp = LocalDateTime.now();

    public Transaction() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }

    public User getReceiver() { return receiver; }
    public void setReceiver(User receiver) { this.receiver = receiver; }

    public BigDecimal getAmountSent() { return amountSent; }
    public void setAmountSent(BigDecimal amountSent) { this.amountSent = amountSent; }

    public String getSenderCurrency() { return senderCurrency; }
    public void setSenderCurrency(String senderCurrency) { this.senderCurrency = senderCurrency; }

    public BigDecimal getAmountReceived() { return amountReceived; }
    public void setAmountReceived(BigDecimal amountReceived) { this.amountReceived = amountReceived; }

    public String getReceiverCurrency() { return receiverCurrency; }
    public void setReceiverCurrency(String receiverCurrency) { this.receiverCurrency = receiverCurrency; }

    public BigDecimal getExchangeRate() { return exchangeRate; }
    public void setExchangeRate(BigDecimal exchangeRate) { this.exchangeRate = exchangeRate; }

    public BigDecimal getPlatformFee() { return platformFee; }
    public void setPlatformFee(BigDecimal platformFee) { this.platformFee = platformFee; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
