package com.globalpay.api.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;

@Document(collection = "wallets")
public class Wallet {

    @Id
    private String id;

    @DBRef
    private User user;

    private String currency;
    private BigDecimal balance = BigDecimal.ZERO;

    public Wallet() {}

    public Wallet(String id, User user, String currency, BigDecimal balance) {
        this.id = id;
        this.user = user;
        this.currency = currency;
        this.balance = balance;
    }

    public Wallet(User user, String currency, BigDecimal initialBalance) {
        this.user = user;
        this.currency = currency;
        this.balance = initialBalance;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}
