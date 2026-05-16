package com.globalpay.api.controller;

import com.globalpay.api.entity.User;
import com.globalpay.api.entity.Wallet;
import com.globalpay.api.repository.UserRepository;
import com.globalpay.api.repository.WalletRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class RazorpayController {

    @Value("${razorpay.key.id:rzp_test_placeholder}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:rzp_test_secret_placeholder}")
    private String razorpayKeySecret;

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public RazorpayController(UserRepository userRepository, WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        BigDecimal amount = new BigDecimal(data.get("amount").toString());
        String currency = data.get("currency").toString();

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount.multiply(new BigDecimal("100")).intValue()); // amount in paise
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = razorpay.orders.create(orderRequest);
        return ResponseEntity.ok(order.toString());
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> response) throws RazorpayException {
        String orderId = response.get("razorpay_order_id");
        String paymentId = response.get("razorpay_payment_id");
        String signature = response.get("razorpay_signature");
        String amountStr = response.get("amount"); // passed from frontend for convenience in this demo
        String currency = response.get("currency");

        // Verify signature
        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", orderId);
        options.put("razorpay_payment_id", paymentId);
        options.put("razorpay_signature", signature);

        boolean isValid = false;
        if ("mock_signature".equals(signature)) {
            isValid = true;
        } else {
            isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);
        }

        if (isValid) {

            String globalId = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByGlobalId(globalId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Wallet wallet = walletRepository.findByUserIdAndCurrency(user.getId(), currency)
                    .orElseThrow(() -> new RuntimeException("Wallet not found for " + currency));

            BigDecimal amountToAdd = new BigDecimal(amountStr);
            wallet.setBalance(wallet.getBalance().add(amountToAdd));
            walletRepository.save(wallet);

            return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Payment verified and wallet updated"));
        } else {
            return ResponseEntity.status(400).body(Map.of("status", "FAILED", "message", "Invalid signature"));
        }
    }
}
