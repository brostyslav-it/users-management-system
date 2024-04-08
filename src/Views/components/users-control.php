<div class="d-flex w-50 gap-2">
    <button class="btn btn-primary" onclick="HandleActions.handleUserAdd()">Add</button>

    <select class="form-select action-select" name="user_action" id="action-select-<?= $data['number'] ?>">
        <option value="" selected>-Please Select-</option>

        <option value="1">1. Set active</option>
        <option value="2">2. Set not active</option>
        <option value="3">3. Delete</option>
    </select>

    <button class="btn btn-primary" id="ok-button-<?= $data['number'] ?>" onclick="HandleActions.handleOkControl(<?= $data['number'] ?>)">OK
    </button>
</div>
