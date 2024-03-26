<?php

namespace Src\Views;

/**
 * Class for rendering views.
 */
class View
{
    /** @var string The path to the views directory. */
    private const VIEWS_PATH = APP_PATH . '/src/Views/';

    /**
     * Renders a full page view.
     * @param string $pageName The name of the page view file.
     * @param array $data Optional data to pass to the view.
     * @return void
     */
    public static function page(string $pageName, array $data = []): void
    {
        extract(['data' => $data]);
        require_once self::VIEWS_PATH . "pages/$pageName.php";
    }

    /**
     * Renders a component view.
     * @param string $componentName The name of the component view file.
     * @param array $data Optional data to pass to the view.
     * @return void
     */
    public static function component(string $componentName, array $data = []): void
    {
        extract(['data' => $data]);
        require self::VIEWS_PATH . "components/$componentName.php";
    }
}
