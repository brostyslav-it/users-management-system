<?php
require_once '../vendor/autoload.php';
define('APP_PATH', dirname(__DIR__));

use Src\Routing\Router;

$router = new Router();
$router->setupRouting();
