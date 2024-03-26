<?php

namespace Src\Routing;

/**
 * Represents a route for routing requests.
 */
readonly class Route
{
    /**
     * Constructs a new Route instance.
     * @param string $uri The URI pattern for the route.
     * @param string $method The HTTP method for the route.
     * @param array $handle The handling functions or controllers for the route.
     */
    private function __construct(private string $uri, private string $method, private array $handle)
    {
    }

    /**
     * Creates a new GET route.
     * @param string $uri The URI pattern for the route.
     * @param array $handle The handling functions or controllers for the route.
     * @return static A new Route instance for GET method.
     */
    public static function get(string $uri, array $handle): static
    {
        return new static($uri, 'GET', $handle);
    }

    /**
     * Creates a new POST route.
     * @param string $uri The URI pattern for the route.
     * @param array $handle The handling functions or controllers for the route.
     * @return static A new Route instance for POST method.
     */
    public static function post(string $uri, array $handle): static
    {
        return new static($uri, 'POST', $handle);
    }

    /**
     * Retrieves the URI pattern for the route.
     * @return string The URI pattern.
     */
    public function getUri(): string
    {
        return $this->uri;
    }

    /**
     * Retrieves the HTTP method for the route.
     * @return string The HTTP method.
     */
    public function getMethod(): string
    {
        return $this->method;
    }

    /**
     * Retrieves the handling functions or controllers for the route.
     * @return array The handling functions or controllers.
     */
    public function getHandle(): array
    {
        return $this->handle;
    }
}
