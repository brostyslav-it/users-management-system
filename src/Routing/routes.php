<?php

use Src\Controllers\UserSystemController;
use Src\Routing\Route;

return [
    Route::get('#^/$#', [UserSystemController::class, 'usersPage']),
    Route::post('#^/add$#', [UserSystemController::class, 'addUser']),
    Route::get('#^/users$#', [UserSystemController::class, 'getUsers']),
    Route::get('#^/roles$#', [UserSystemController::class, 'getRoles']),
    Route::get('#^/user/(\d+)$#', [UserSystemController::class, 'getUser']),
    Route::post('#^/update$#', [UserSystemController::class, 'updateUser']),
    Route::post('#^/delete$#', [UserSystemController::class, 'deleteUsers']),
    Route::post('#^/update-status$#', [UserSystemController::class, 'updateUsersStatus'])
];
