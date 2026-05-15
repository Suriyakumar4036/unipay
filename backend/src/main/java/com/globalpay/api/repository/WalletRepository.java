package com.globalpay.api.repository;

import com.globalpay.api.entity.Wallet;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface WalletRepository extends MongoRepository<Wallet, String> {
    List<Wallet> findByUserId(String userId);
    Optional<Wallet> findByUserIdAndCurrency(String userId, String currency);
}
