package reservation_voyage.Service;

import java.util.Optional;

import reservation_voyage.DAO.UserDAO;
import reservation_voyage.Metier.User;

public class LoginService {

    private UserDAO userDao = new UserDAO();

    public Optional<User> authenticate(String username, String password) {
        Optional<User> user = userDao.findUserByUsername(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }
        return Optional.empty();
    }

    public void saveUser(User user) {
        userDao.saveUser(user);
    }

}
