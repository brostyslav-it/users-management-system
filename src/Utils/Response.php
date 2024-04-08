<?php

namespace Src\Utils;

/**
 * Class for handling HTTP responses.
 */
class Response
{
    /**
     * Sends a success response.
     * @param array $additionalData Additional data to include in the response.
     * @return void
     */
    public static function success(array $additionalData = []): void
    {
        self::json(['status' => true, 'error' => null, ...$additionalData]);
    }

    /**
     * Sends an error response.
     * @param int $code The error code.
     * @param string $message The error message.
     * @return void
     */
    public static function error(int $code, string $message): void
    {
        self::json(['status' => false, 'error' => ['code' => $code, 'message' => $message]]);
    }

    /**
     * Sends a JSON response.
     * @param array $data The data to encode and send as JSON.
     * @return void
     */
    private static function json(array $data): void
    {
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
}
