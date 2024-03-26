<?php

namespace Src\Entities;

use Src\Utils\Request;

/**
 * Represents a user entity.
 */
readonly class User
{
    /**
     * Constructs a new User instance.
     * @param string|null $firstName The first name of the user.
     * @param string|null $lastName The last name of the user.
     * @param bool|null $status The status of the user.
     * @param string|null $role The role of the user.
     */
    private function __construct(private ?string $firstName, private ?string $lastName, private ?bool $status, private ?string $role)
    {
    }

    /**
     * Retrieves a new User instance based on request data.
     * @return static A new User instance.
     */
    public static function getUser(): static
    {
        return new static(
            Request::getPost('first_name'),
            Request::getPost('last_name'),
            Request::getPost('status'),
            Request::getPost('role'),
        );
    }

    /**
     * Retrieves the first name of the user.
     * @return string|null The first name of the user.
     */
    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    /**
     * Retrieves the last name of the user.
     * @return string|null The last name of the user.
     */
    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    /**
     * Retrieves the status of the user.
     * @return bool The status of the user.
     */
    public function getStatus(): bool
    {
        return $this->status;
    }

    /**
     * Retrieves the role of the user.
     * @return string|null The role of the user.
     */
    public function getRole(): ?string
    {
        return $this->role;
    }
}
