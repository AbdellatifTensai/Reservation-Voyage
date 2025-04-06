package com.trainease.dao;

import com.trainease.entity.User;
import java.util.List;
import java.util.Optional;

public interface UserDAO {
    List<User> findAll();
    Optional<User> findById(Long id);
    Optional<User> findByUsername(String username);
    User save(User user);
    void update(User user);
    boolean delete(Long id);
}