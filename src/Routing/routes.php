<?php

use Src\Controllers\UserSystemController;
use Src\Routing\Route;

return [
    Route::get('#^/$#', [UserSystemController::class, 'usersPage']),
    Route::post('#^/add$#', [UserSystemController::class, 'addUser']),
    Route::post('#^/user/\d+$#', [UserSystemController::class, 'getUser']),
    Route::post('#^/update$#', [UserSystemController::class, 'updateUser']),
    Route::post('#^/delete$#', [UserSystemController::class, 'deleteUsers']),
    Route::post('#^/update-status$#', [UserSystemController::class, 'updateUsersStatus'])
];
