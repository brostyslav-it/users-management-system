<?php

namespace Src\Controllers;

use Src\Core\Controller;
use Src\Entities\User;
use Src\Models\UserModel;
use Src\Utils\Request;
use Src\Utils\Response;
use Src\Views\View;

/**
 * Controller for managing user-related operations in the system.
 */
class UserSystemController extends Controller
{
    /** @var UserModel The model for user-related database operations. */
    private UserModel $model;

    /**
     * Constructs a new UserSystemController instance.
     */
    public function __construct()
    {
        $this->model = new UserModel();
    }

    /**
     * Displays the users page.
     */
    public function usersPage(): void
    {
        if (!($users = $this->model->getUsers()) || !($roles = $this->model->getRoles())) {
            die('Server Error');
        }

        View::page('users-page', ['users' => $users->fetch_all(MYSQLI_ASSOC), 'roles' => $roles->fetch_all(MYSQLI_ASSOC)]);
    }

    /**
     * Adds a new user.
     */
    public function addUser(): void
    {
        $this->validateWithResponse($this->getBasicUserValidation($user = User::getUser()));
        $this->validateWithResponse([[($id = $this->model->addUser($user)) === false, 'Error adding user', 500]]);
        Response::success(['id' => $id]);
    }

    /**
     * Retrieves a specific user.
     */
    public function getUser(): void
    {
        preg_match('#^/user/(\d+)$#', $_SERVER['REQUEST_URI'], $match);
        $this->validateWithResponse([[!$user = $this->model->getUser($match[1]), "There is no user with id $match[1]", 404]]);
        Response::success(['user' => $user]);
    }

    /**
     * Updates an existing user.
     */
    public function updateUser(): void
    {
        $this->validateWithResponse($this->getBasicUserValidation($user = User::getUser()));

        $this->validateWithResponse([
            [!$id = Request::getPost('id'), 'ID is empty', 400],
            [!$this->model->updateUser($id, $user), "There is no user with id $id", 404]
        ]);

        Response::success();
    }

    /**
     * Deletes one or more users.
     */
    public function deleteUsers(): void
    {
        $this->validateWithResponse([
            [!isset($_POST['id']), 'ID is empty', 400],
            [count($_POST['id']) !== count(array_filter($_POST['id'], 'is_numeric')), 'Invalid ID', 400],
        ]);

        $this->validateWithResponse([[!$this->model->deleteUsers($_POST['id']), 'Error deleting', 404]]);

        Response::success();
    }

    /**
     * Updates status of one or more users.
     */
    public function updateUsersStatus(): void
    {
        $this->validateWithResponse([
            [!isset($_POST['status']), 'Status is empty', 400],
            [!isset($_POST['id']), 'ID is empty', 400],
            [count($_POST['id']) !== count(array_filter($_POST['id'], 'is_numeric')), 'Invalid ID', 400]
        ]);

        $this->validateWithResponse([[!$this->model->updateUsersStatus($_POST['id'], Request::getPost('status')), "Some user doesn't exist, error updating", 404]]);

        Response::success();
    }

    /**
     * Validates basic user information.
     * @param User $user The user entity object.
     * @return array Array of validation rules.
     */
    private function getBasicUserValidation(User $user): array
    {
        return [
            [empty($user->getFirstName()), 'First name is empty', 400],
            [mb_strlen($user->getFirstName()) > 70, 'First name can be maximum 70 characters', 400],
            [empty($user->getLastName()), 'Last name is empty', 400],
            [mb_strlen($user->getLastName()) > 70, 'Last name can be maximum 70 characters', 400],
            [empty($user->getRole()), 'Role is empty', 400]
        ];
    }
}
