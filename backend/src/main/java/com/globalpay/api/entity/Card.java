package com.globalpay.api.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "cards")
public class Card {

    @Id
    private String id;

    @DBRef
    private User user;

    private String cardType; // DEBIT, CREDIT
    private String cardNumber;
    private String cardholderName;
    private String expiryDate; // MM/YY
    private String cvv;
    private String network; // VISA, MASTERCARD
    private String pin;
    private String status; // ACTIVE, BLOCKED
    private LocalDateTime createdAt = LocalDateTime.now();

    public Card() {}

    public Card(User user, String cardType, String cardNumber, String cardholderName, String expiryDate, String cvv, String network, String pin, String status) {
        this.user = user;
        this.cardType = cardType;
        this.cardNumber = cardNumber;
        this.cardholderName = cardholderName;
        this.expiryDate = expiryDate;
        this.cvv = cvv;
        this.network = network;
        this.pin = pin;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getCardType() { return cardType; }
    public void setCardType(String cardType) { this.cardType = cardType; }

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

    public String getCardholderName() { return cardholderName; }
    public void setCardholderName(String cardholderName) { this.cardholderName = cardholderName; }

    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

    public String getCvv() { return cvv; }
    public void setCvv(String cvv) { this.cvv = cvv; }

    public String getNetwork() { return network; }
    public void setNetwork(String network) { this.network = network; }

    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
