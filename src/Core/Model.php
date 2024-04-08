<?php

namespace Src\Core;

use mysqli;
use mysqli_result;
use Src\Database\Connection;

/**
 * Base model class providing common database functionality.
 */
class Model
{
    /** @var mysqli The database connection. */
    private mysqli $connection;

    /**
     * Constructs a new Model instance.
     */
    public function __construct()
    {
        $this->connection = Connection::getInstance()->getConnection();
    }

    /**
     * Executes a SQL query with optional parameters.
     * @param string $sql The SQL query string.
     * @param array|null $params The query parameters (optional).
     * @return false|mysqli_result The query result or false on failure.
     */
    protected function query(string $sql, array $params = null): false|mysqli_result
    {
        $this->resetResults();

        $query = $this->connection->prepare($sql);

        if ($params !== null) {
            $query->bind_param($params[0], ...$params[1]);
        }

        $query->execute();

        return $query->get_result();
    }

    /**
     * Retrieves the last inserted ID.
     * @return int|string The last inserted ID.
     */
    protected function id(): int|string
    {
        return $this->connection->insert_id;
    }

    /**
     * Resets any pending result sets.
     */
    private function resetResults(): void
    {
        while ($this->connection->next_result()) {
            $this->connection->store_result();
        }
    }
}
