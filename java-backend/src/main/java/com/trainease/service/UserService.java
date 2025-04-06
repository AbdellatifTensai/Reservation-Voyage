package com.trainease.service;

import com.trainease.entity.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    Optional<User> getUserByUsername(String username);
    User createUser(User user);
    void updateUser(User user);
    boolean deleteUser(Long id);
    boolean authenticate(String username, String password);
}