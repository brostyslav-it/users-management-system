<table class="table table-bordered mt-3" id="users-table">
    <thead>
    <tr>
        <th scope="col"><input class="form-check-input" id="group-check" type="checkbox"></th>
        <th scope="col">Name</th>
        <th scope="col">Role</th>
        <th scope="col">Status</th>
        <th scope="col">Options</th>
    </tr>
    </thead>

    <tbody>
    <?php foreach ($data as $user): ?>
        <tr id="user-<?= $user['id'] ?>">
            <td><input class="form-check-input user-check" onchange="DOMActions.updateGroupCheck()" type="checkbox" value="<?= $user['id'] ?>"></td>
            <td class="user-name"><?= $user['first_name'] ?> <?= $user['last_name'] ?></td>
            <td class="user-role"><?= $user['role_name'] ?></td>

            <td class="text-center">
                <svg fill="<?= $user['status'] ? 'green' : 'gray' ?>" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                     class="bi bi-circle-fill user-active" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="8"/>
                </svg>
            </td>

            <td class="text-center">
                <div class="btn-group" role="group" id="user-actions-buttons">
                    <button type="button" class="btn btn-outline-dark d-flex justify-content-center align-items-center" data-bs-toggle="modal" data-bs-target="#user-modal" data-action="update" data-id="<?= $user['id'] ?>">
                        <img src="/assets/edit.ico" alt="Edit icon" width="16">
                    </button>

                    <button type="button" class="btn btn-outline-dark d-flex justify-content-center align-items-center" onclick="handleUserDeletion(<?= $user['id'] ?>)">
                        <img src="/assets/delete.ico" alt="Edit icon" width="16">
                    </button>
                </div>
            </td>
        </tr>
    <?php endforeach; ?>
    </tbody>
</table>
