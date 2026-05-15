package com.globalpay.api.dto;

public class LoginRequest {
    private String globalId;
    private String password;

    public LoginRequest() {}
    public LoginRequest(String globalId, String password) {
        this.globalId = globalId;
        this.password = password;
    }

    public String getGlobalId() { return globalId; }
    public void setGlobalId(String globalId) { this.globalId = globalId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
