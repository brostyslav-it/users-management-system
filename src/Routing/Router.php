<?php

namespace Src\Routing;

/**
 * Class responsible for routing requests to appropriate controllers.
 */
class Router
{
    /** @var array Stores routes for different HTTP methods. */
    private array $routes = [
        'GET' => [],
        'POST' => []
    ];

    /**
     * Constructs a new Router instance and initializes routes.
     */
    public function __construct()
    {
        $this->initRouter();
    }

    /**
     * Sets up routing by finding and executing the appropriate route.
     * Redirects to the homepage if no matching route is found.
     * @return void
     */
    public function setupRouting(): void
    {
        if (!$route = $this->findRoute($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD'])) {
            header('Location: /');
            exit;
        }

        [$controller, $action] = $route->getHandle();

        $controller = new $controller;
        $controller->$action();
    }

    /**
     * Finds the route that matches the given URI and HTTP method.
     * @param string $uri The URI of the request.
     * @param string $method The HTTP method of the request.
     * @return Route|false The matching route, or false if not found.
     */
    private function findRoute(string $uri, string $method): Route|false
    {
        foreach ($this->routes[$method] as $route) {
            if (preg_match($route->getUri(), $uri)) {
                return $route;
            }
        }

        return false;
    }

    /**
     * Initializes the router by loading routes from the routes.php file.
     * @return void
     */
    private function initRouter(): void
    {
        foreach (require_once 'routes.php' as $route) {
            $this->routes[$route->getMethod()][] = $route;
        }
    }
}
