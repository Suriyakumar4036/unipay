package com.globalpay.api.config;

import com.globalpay.api.entity.CurrencyRate;
import com.globalpay.api.repository.CurrencyRateRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(CurrencyRateRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                List<CurrencyRate> rates = Arrays.asList(
                    // From USD
                    new CurrencyRate("USD", "EUR", new BigDecimal("0.92")),
                    new CurrencyRate("USD", "INR", new BigDecimal("83.50")),
                    new CurrencyRate("USD", "GBP", new BigDecimal("0.79")),
                    new CurrencyRate("USD", "JPY", new BigDecimal("156.00")),
                    new CurrencyRate("USD", "AUD", new BigDecimal("1.50")),
                    
                    // From EUR
                    new CurrencyRate("EUR", "USD", new BigDecimal("1.09")),
                    new CurrencyRate("EUR", "INR", new BigDecimal("90.75")),
                    new CurrencyRate("EUR", "GBP", new BigDecimal("0.86")),
                    
                    // From INR
                    new CurrencyRate("INR", "USD", new BigDecimal("0.012")),
                    new CurrencyRate("INR", "EUR", new BigDecimal("0.011")),
                    new CurrencyRate("INR", "GBP", new BigDecimal("0.0095")),
                    
                    // From GBP
                    new CurrencyRate("GBP", "USD", new BigDecimal("1.27")),
                    new CurrencyRate("GBP", "EUR", new BigDecimal("1.16")),
                    new CurrencyRate("GBP", "INR", new BigDecimal("105.70")),
                    
                    // From JPY
                    new CurrencyRate("JPY", "USD", new BigDecimal("0.0064")),
                    new CurrencyRate("JPY", "INR", new BigDecimal("0.54")),
                    
                    // From AUD
                    new CurrencyRate("AUD", "USD", new BigDecimal("0.67")),
                    new CurrencyRate("AUD", "INR", new BigDecimal("55.60"))
                );
                repository.saveAll(rates);
                System.out.println("Currency rates seeded successfully!");
            }
        };
    }
}
