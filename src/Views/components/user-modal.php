<div class="modal fade" id="user-modal" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modal-title"></h5>
            </div>

            <div class="modal-body">
                <div class="form-group">
                    <label for="first-name" class="col-form-label">First name</label>
                    <input type="text" class="form-control" id="first-name" name="first_name" maxlength="70">
                </div>

                <div class="form-group">
                    <label for="last-name" class="col-form-label">Last name</label>
                    <input type="text" class="form-control" id="last-name" name="last_name" maxlength="70">
                </div>

                <div class="form-group">
                    <label for="status" class="col-form-label">Status</label>

                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="status" name="status">
                    </div>
                </div>

                <div class="form-group">
                    <label for="role" class="col-form-label">Role</label>

                    <select class="form-select" id="role" name="role">
                        <option value="" selected>-Please Select-</option>

                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="modal-action"></button>
            </div>
        </div>
    </div>
</div>
