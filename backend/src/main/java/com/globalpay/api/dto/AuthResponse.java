package com.globalpay.api.dto;

public class AuthResponse {
    private String token;
    private String globalId;
    private String name;

    public AuthResponse() {}
    public AuthResponse(String token, String globalId, String name) {
        this.token = token;
        this.globalId = globalId;
        this.name = name;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getGlobalId() { return globalId; }
    public void setGlobalId(String globalId) { this.globalId = globalId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
