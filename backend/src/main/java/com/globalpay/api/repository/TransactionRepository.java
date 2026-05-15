package com.globalpay.api.repository;

import com.globalpay.api.entity.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findBySenderIdOrReceiverIdOrderByTimestampDesc(String senderId, String receiverId);
}
