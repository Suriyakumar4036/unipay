package com.globalpay.api.dto;

import java.math.BigDecimal;

public class TransferRequest {
    private String receiverGlobalId;
    private BigDecimal amount;
    private String currency;

    public TransferRequest() {}

    public String getReceiverGlobalId() { return receiverGlobalId; }
    public void setReceiverGlobalId(String receiverGlobalId) { this.receiverGlobalId = receiverGlobalId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
