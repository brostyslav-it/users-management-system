<?php

namespace Src\Database;

use mysqli;

/**
 * Singleton class responsible for managing database connections.
 */
class Connection
{
    /** @var Connection|null The singleton instance. */
    private static ?Connection $instance = null;

    /** @var mysqli The database connection. */
    private mysqli $connection;

    private const HOST = 'localhost:3306';
    private const USERNAME = 'root';
    private const PASSWORD = 'Rostik2005$';
    private const DATABASE = 'users_system';

    /**
     * Constructs a new Connection instance.
     */
    private function __construct()
    {
        $this->connection = new mysqli(self::HOST, self::USERNAME, self::PASSWORD, self::DATABASE);

        if ($this->connection->connect_error) {
            die('Server error');
        }
    }

    /**
     * Retrieves the singleton instance of the Connection class.
     * @return Connection The singleton instance.
     */
    public static function getInstance(): Connection
    {
        if (!self::$instance) {
            self::$instance = new Connection();
        }

        return self::$instance;
    }

    /**
     * Retrieves the database connection.
     * @return mysqli The database connection.
     */
    public function getConnection(): mysqli
    {
        return $this->connection;
    }

    /**
     * Prevents cloning of the Connection instance.
     */
    private function __clone()
    {
    }

    /**
     * Prevents deserialization of the Connection instance.
     */
    public function __wakeup()
    {
    }
}
