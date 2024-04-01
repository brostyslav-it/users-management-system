<?php

namespace Src\Models;

use mysqli_result;
use Src\Core\Model;
use Src\Entities\User;

/**
 * Model class for user-related database operations.
 */
class UserModel extends Model
{
    /**
     * Retrieves all users from the database.
     * @return false|mysqli_result The query result containing users, or false on failure.
     */
    public function getUsers(): false|mysqli_result
    {
        return $this->query('SELECT * FROM users JOIN roles ON users.role = roles.role_id');
    }

    /**
     * Retrieves all roles from the database.
     * @return false|mysqli_result The query result containing roles, or false on failure.
     */
    public function getRoles(): false|mysqli_result
    {
        return $this->query('SELECT * FROM roles');
    }

    /**
     * Adds a new user to the database.
     * @param User $user The user to be added.
     * @return bool|int False on failure, otherwise the ID of the inserted user.
     */
    public function addUser(User $user): bool|int
    {
        return $this->query(
            'INSERT INTO users VALUES (NULL, ?, ?, ?, ?)',
            ['ssii', [
                $user->getFirstName(),
                $user->getLastName(),
                $user->getStatus(),
                $user->getRole()
            ]]
        ) ? false : $this->id();
    }

    /**
     * Retrieves a user from the database by ID.
     * @param int $id The ID of the user to retrieve.
     * @return false|array|null The user data as an array, or false if user not found.
     */
    public function getUser(int $id): false|array|null
    {
        $result = $this->query('SELECT * FROM users JOIN roles ON users.role = roles.role_id WHERE users.id = ?', ['i', [$id]]);
        return $result->num_rows > 0 ? $result->fetch_assoc() : false;
    }

    /**
     * Updates a user in the database.
     * @param int $id The ID of the user to update.
     * @param User $user The updated user data.
     * @return bool True if update was successful, false otherwise.
     */
    public function updateUser(int $id, User $user): bool
    {
        if (!$this->usersExist([$id])) {
            return false;
        }

        $this->query(
            'UPDATE users SET first_name = ?, last_name = ?, status = ?, role = ? WHERE id = ?',
            ['ssiii', [
                $user->getFirstName(),
                $user->getLastName(),
                $user->getStatus(),
                $user->getRole(),
                $id
            ]]
        );

        return true;
    }

    /**
     * Deletes users from the database.
     * @param array $id The IDs of the users to delete.
     * @return bool True if deletion was successful, false otherwise.
     */
    public function deleteUsers(array $id): bool
    {
        if (!$this->usersExist($id)) {
            return false;
        }

        $this->query('DELETE FROM users WHERE id IN (' . implode(',', $id) . ')');

        return true;
    }

    /**
     * Updates the status of users in the database.
     * @param array $id The IDs of the users to update.
     * @param bool $status The new status for the users.
     * @return bool True if update was successful, false otherwise.
     */
    public function updateUsersStatus(array $id, bool $status): bool
    {
        if (!$this->usersExist($id)) {
            return false;
        }

        $this->query('UPDATE users SET status = ? WHERE id IN (' . implode(',', $id) . ')', ['i', [$status]]);

        return true;
    }

    /**
     * Checks if users with specified IDs exist in the database.
     * @param array $id The IDs of the users to check.
     * @return bool True if all users exist, false otherwise.
     */
    private function usersExist(array $id): bool
    {
        return $this->query('SELECT * FROM users WHERE id IN (' . implode(',', $id) . ')')->num_rows === count($id);
    }
}
