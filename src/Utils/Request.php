<?php

namespace Src\Utils;

/**
 * Class for handling request data.
 */
class Request
{
    /**
     * Retrieves a POST parameter value and sanitizes it.
     * @param string $key The key of the POST parameter.
     * @return string|null The sanitized POST parameter value, or null if not found.
     */
    public static function getPost(string $key): ?string
    {
        return isset($_POST[$key]) ? htmlspecialchars($_POST[$key]) : null;
    }
}
