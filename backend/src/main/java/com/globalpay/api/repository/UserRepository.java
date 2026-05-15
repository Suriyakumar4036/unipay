package com.globalpay.api.repository;

import com.globalpay.api.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByGlobalId(String globalId);
    Optional<User> findByEmail(String email);
    boolean existsByGlobalId(String globalId);
    boolean existsByEmail(String email);
}
