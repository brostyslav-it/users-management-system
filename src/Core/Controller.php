<?php

namespace Src\Core;

use Src\Utils\Response;

/**
 * Base controller class providing common functionality.
 */
class Controller
{
    /**
     * Validates rules and responds with error if validation fails.
     * @param array $rules The validation rules.
     * @return void
     */
    protected function validateWithResponse(array $rules): void
    {
        if (($validation = self::validate($rules)) !== true) {
            Response::error($validation[1], $validation[0]);
        }
    }

    /**
     * Validates an array of rules.
     * @param array $rules The validation rules.
     * @return bool|array True if validation passes, otherwise an array containing error message and status code.
     */
    protected static function validate(array $rules): bool|array
    {
        foreach ($rules as $rule) {
            if ($rule[0]) {
                return [$rule[1], $rule[2]];
            }
        }

        return true;
    }
}
