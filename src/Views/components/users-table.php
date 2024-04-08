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
                    <button type="button" class="btn btn-outline-secondary" onclick="HandleActions.handleUserUpdate(<?= $user['id'] ?>)"><i class="bi bi-pencil-square"></i></button>
                    <button type="button" class="btn btn-outline-secondary" onclick="HandleActions.handleUserDeletion(<?= $user['id'] ?>)"><i class="bi bi-trash"></i></button>
                </div>
            </td>
        </tr>
    <?php endforeach; ?>
    </tbody>
</table>
