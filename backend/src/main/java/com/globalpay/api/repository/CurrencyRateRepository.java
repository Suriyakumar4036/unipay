package com.globalpay.api.repository;

import com.globalpay.api.entity.CurrencyRate;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface CurrencyRateRepository extends MongoRepository<CurrencyRate, String> {
    Optional<CurrencyRate> findByFromCurrencyAndToCurrency(String fromCurrency, String toCurrency);
}
