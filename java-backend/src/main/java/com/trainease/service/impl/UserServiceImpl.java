package com.trainease.service.impl;

import com.trainease.dao.UserDAO;
import com.trainease.entity.User;
import com.trainease.service.UserService;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

public class UserServiceImpl implements UserService {
    
    private final UserDAO userDAO;
    
    public UserServiceImpl(UserDAO userDAO) {
        this.userDAO = userDAO;
    }
    
    @Override
    public List<User> getAllUsers() {
        return userDAO.findAll();
    }
    
    @Override
    public Optional<User> getUserById(Long id) {
        return userDAO.findById(id);
    }
    
    @Override
    public Optional<User> getUserByUsername(String username) {
        return userDAO.findByUsername(username);
    }
    
    @Override
    public User createUser(User user) {
        // Hash the password before saving
        user.setPassword(hashPassword(user.getPassword()));
        return userDAO.save(user);
    }
    
    @Override
    public void updateUser(User user) {
        // If password is being updated, hash it
        Optional<User> existingUser = userDAO.findById(user.getId());
        if (existingUser.isPresent() && !existingUser.get().getPassword().equals(user.getPassword())) {
            user.setPassword(hashPassword(user.getPassword()));
        }
        userDAO.update(user);
    }
    
    @Override
    public boolean deleteUser(Long id) {
        return userDAO.delete(id);
    }
    
    @Override
    public boolean authenticate(String username, String password) {
        Optional<User> userOpt = userDAO.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return user.getPassword().equals(hashPassword(password));
        }
        return false;
    }
    
    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = md.digest(password.getBytes());
            
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
}
