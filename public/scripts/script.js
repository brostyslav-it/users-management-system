/**
 * Class representing DOM actions.
 */
class DOMActions {
    /**
     * Update user form inputs.
     * @param {string} firstName - The first name of the user.
     * @param {string} lastName - The last name of the user.
     * @param {boolean} status - The status of the user.
     * @param {string} role - The role of the user.
     */
    static updateUserFormInputs(firstName, lastName, status, role) {
        $('#first-name').val(firstName)
        $('#last-name').val(lastName)
        $('#status').prop('checked', status)
        $('#role').val(role).change()
    }

    /**
     * Check if checkboxes are selected and update group check.
     */
    static updateGroupCheck() {
        DOMElements.groupCheck.prop('checked', $('.user-check:checked').length === $('.user-check').length)
    }

    /**
     * Create error content.
     * @param {string} error - The error message.
     * @returns {string} - Error message wrapped in HTML.
     */
    static createErrorsContent(error) {
        return `<div class="alert alert-danger">${error}</div>`
    }

    /**
     * Create user row.
     * @param {Object} user - The user data.
     * @returns {string} - HTML of the user row.
     */
    static createUserRow(user) {
        return `
        <tr id="user-${user.id}">
            <td><input class="form-check-input user-check" onchange="DOMActions.updateGroupCheck()" type="checkbox" value="${user.id}"></td>
            <td class="user-name">${user.first_name} ${user.last_name}</td>
            <td class="user-role">${user.role_name}</td>
        
            <td class="text-center">
                <svg fill="${Utils.getActiveColor(user.status)}" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                     class="bi bi-circle-fill user-active" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="8"/>
                </svg>
            </td>
        
            <td class="text-center">
                <div class="btn-group" role="group" id="user-actions-buttons">
                    <button type="button" class="btn btn-outline-dark d-flex justify-content-center align-items-center" data-bs-toggle="modal" data-bs-target="#user-modal" data-action="update" data-id="${user.id}">
                        <img src="/assets/edit.ico" alt="Edit icon" width="16">
                    </button>

                    <button type="button" class="btn btn-outline-dark d-flex justify-content-center align-items-center" onclick="handleUserDeletion(${user.id})">
                        <img src="/assets/delete.ico" alt="Edit icon" width="16">
                    </button>
                </div>
            </td>
        </tr>
        `
    }
}

/**
 * Class representing DOM elements and their actions.
 */
class DOMElements {
    /**
     * User modal element.
     * @type {jQuery}
     */
    static userModal = $('#user-modal')

    /**
     * Confirm modal element.
     * @type {jQuery}
     */
    static confirmModal = $('#confirm-modal')

    /**
     * Confirm modal label element.
     * @type {jQuery}
     */
    static confirmModalLabel = $('#confirm-modal-label')

    /**
     * Confirm modal body element.
     * @type {jQuery}
     */
    static confirmModalBody = $('#confirm-modal-body')

    /**
     * Confirm modal button element.
     * @type {jQuery}
     */
    static confirmModalBtn = $('#confirm-modal-btn')

    /**
     * Group check element.
     * @type {jQuery}
     */
    static groupCheck = $('#group-check')
}

/**
 * Class representing utility functions.
 */
class Utils {
    /**
     * Create a user object.
     * @param {string|null} id - The user ID.
     * @returns {Object} - The user object.
     */
    static createUser(id = null) {
        const user = {
            first_name: $('#first-name').val().trim(),
            last_name: $('#last-name').val().trim(),
            status: $('#status').prop('checked') ? 1 : 0,
            role: $('#role').val().trim()
        }

        if (id !== null) {
            user.id = id
        }

        return user
    }

    /**
     * Get active color based on user status.
     * @param {boolean} status - The status of the user.
     * @returns {string} - Color string.
     */
    static getActiveColor(status) {
        return status ? 'green' : 'gray'
    }
}

/**
 * Class representing request handling.
 */
class RequestHandler {
    /**
     * Handle request response.
     * @param {Object} response - The response object.
     * @param {Function} successFunction - Function to execute on success.
     * @param isUserModal - Detects is user modal.
     * @param {jQuery|null} caller - The calling element.
     */
    static handleRequest(response, successFunction, isUserModal = false, caller = null) {
        if (!response.status) {
            const errorMessage = response.error.message
            isUserModal ? ModalActions.setUserModalError(errorMessage) : ModalActions.showErrorModal(errorMessage)
            return
        }

        if (caller !== null) {
            caller.modal('hide')
        }

        successFunction()

        if (isUserModal) {
            $('#user-modal-error')
                .prop('class', '')
                .empty()
        }
    }
}

/**
 * Class representing group actions.
 */
class GroupActions {
    /**
     * Create a group action.
     * @param {number} controlsNumber - The number of controls.
     */
    constructor(controlsNumber) {
        this.controlsNumber = controlsNumber
        this.action = $(`#action-select-${this.controlsNumber}`).val()
        this.checkedUsers = $('.user-check:checked')
        this.checkedUsersId = this.getCheckedUsersId()
    }

    /**
     * Get checked users' IDs.
     * @returns {Array} - Array of user IDs.
     */
    getCheckedUsersId() {
        return this.checkedUsers.get().map(el => el.value)
    }

    /**
     * Handle click on OK button.
     */
    async okClicked() {
        if (this.checkedUsers.length > 0 && this.action === '') {
            ModalActions.showErrorModal('Choose an action to perform with selected users')
            return
        }

        if (this.checkedUsers.length === 0 && this.action !== '') {
            ModalActions.showErrorModal('Select some users to perform an action')
            return
        }

        await this.handleAction()
    }

    /**
     * Handle selected action.
     */
    async handleAction() {
        switch (this.action) {
            case '1':
                await this.setUsersActive()
                break;

            case '2':
                await this.setUsersNotActive()
                break;

            case '3':
                await this.confirmUsersDeletion()
                break;

            default:
                ModalActions.showErrorModal('Choose action and users')
        }
    }

    /**
     * Set selected users as active.
     */
    async setUsersActive() {
        RequestHandler.handleRequest(await $.post('/update-status', {
            id: this.checkedUsersId,
            status: true
        }), () => this.changeCheckedUsersStatus(true))
    }

    /**
     * Set selected users as not active.
     */
    async setUsersNotActive() {
        RequestHandler.handleRequest(await $.post('/update-status', {
            id: this.checkedUsersId,
            status: ''
        }), () => this.changeCheckedUsersStatus(false))
    }

    /**
     * Confirm users deletion.
     */
    async confirmUsersDeletion() {
        await ModalActions.fillAndShowConfirmModal(
            'Deleting selected users confirmation',
            'Delete selected users',
            'Are you sure you want to delete selected users?',
            async () => await this.deleteUsers()
        )
    }

    /**
     * Delete selected users.
     */
    async deleteUsers() {
        RequestHandler.handleRequest(await $.post('/delete', {id: this.checkedUsersId}), () => {
            this.checkedUsers.each(function () {
                $(this).parent().parent().remove()
                DOMElements.groupCheck.prop('checked', false)
            })
        }, false, DOMElements.confirmModal)
    }

    /**
     * Change status of checked users.
     * @param {boolean} status - The status to set.
     */
    changeCheckedUsersStatus(status) {
        this.checkedUsers.each(function () {
            $(this).parent().parent().find('.user-active').attr('fill', Utils.getActiveColor(status))
        })
    }
}

/**
 * Class representing user actions.
 */
class UserActions {
    /**
     * Find user asynchronously.
     * @param {string} id - The user ID.
     * @returns {Promise<Object>} - Promise resolving to user object.
     */
    static async findUser(id) {
        return (await $.getJSON(`/user/${id}`)).user
    }

    /**
     * Add user asynchronously.
     */
    static async addUser() {
        const user = Utils.createUser()
        const res = await $.post(`/add`, user)

        RequestHandler.handleRequest(res, async () => {
            $('#users-table > tbody')
                .append(DOMActions.createUserRow({
                    ...user,
                    color: Utils.getActiveColor(user.status),
                    id: res.id,
                    role_name: $('#role option:selected').text()
                }))
                .find('.user-check')
                .prop('checked', DOMElements.groupCheck.prop('checked'))

            DOMActions.updateGroupCheck()
        }, true, DOMElements.userModal)
    }

    /**
     * Update user asynchronously.
     * @param {string} id - The user ID.
     */
    static async updateUser(id) {
        const user = Utils.createUser(id)

        RequestHandler.handleRequest(await $.post(`/update`, user), () => {
            const userRow = $(`#user-${user.id}`)

            userRow.find('.user-name').text(`${user.first_name} ${user.last_name}`)
            userRow.find('.user-role').text($('#role option:selected').text())
            userRow.find('.user-active').attr('fill', Utils.getActiveColor(user.status))
        }, true, DOMElements.userModal)
    }

    /**
     * Delete user asynchronously.
     * @param {string} id - The user ID.
     */
    static async deleteUser(id) {
        RequestHandler.handleRequest(await $.post('/delete', {id: [id]}), () => {
            DOMElements.confirmModal.modal('hide')
            $(`#user-${id}`).remove()
            DOMActions.updateGroupCheck()
        }, false, DOMElements.confirmModal)
    }
}

/**
 * Class representing modal actions.
 */
class ModalActions {
    /**
     * Errors area element.
     * @type {jQuery}
     */
    static errorsArea = $('#errors-area')

    /**
     * Show error modal.
     * @param {string} error - The error message.
     */
    static showErrorModal(error) {
        $('#error-modal').modal('show')
        this.errorsArea.empty().append(DOMActions.createErrorsContent(error))
    }

    /**
     * Show user modal.
     * @param {object} e - The event object.
     */
    static async userModalShowed(e) {
        if (e.relatedTarget === undefined) {
            return
        }

        this.clearUserModalError()
        DOMActions.updateUserFormInputs('', '', false, '')

        const action = $(e.relatedTarget).data('action')
        const actionText = action.charAt(0).toUpperCase() + action.slice(1)
        const modalActionButton = $('#modal-action')

        $('#modal-title').text(`${actionText} user`)
        modalActionButton.off('click').text(actionText)

        if (action === 'update') {
            const user = await UserActions.findUser($(e.relatedTarget).data('id'))
            DOMActions.updateUserFormInputs(user.first_name, user.last_name, user.status, user.role_id)
            modalActionButton.click(() => UserActions.updateUser(user.id))
            return
        }

        modalActionButton.click(() => UserActions.addUser())
    }

    /**
     * Fill and show confirm modal.
     * @param {string} labelText - The label text.
     * @param {string} btnText - The button text.
     * @param {string} bodyText - The body text.
     * @param {Function} clickFunction - The function to execute on click.
     */
    static async fillAndShowConfirmModal(labelText, btnText, bodyText, clickFunction) {
        DOMElements.confirmModal.modal('show')
        DOMElements.confirmModalBtn.off('click').text(btnText).click(clickFunction)
        DOMElements.confirmModalLabel.text(labelText)
        DOMElements.confirmModalBody.text(bodyText)
    }

    /**
     * Set user modal error.
     * @param {string} error - The error message.
     */
    static setUserModalError(error) {
        $('#user-modal-error')
            .prop('class', 'alert alert-danger')
            .text(error)
    }

    /**
     * Clear user modal error.
     */
    static clearUserModalError() {
        $('#user-modal-error')
            .prop('class', 'd-none')
            .empty()
    }
}

/**
 * Show user modal on show.bs.modal event.
 */
DOMElements.userModal.on('show.bs.modal', (e) => ModalActions.userModalShowed(e))

/**
 * Handle group check change.
 */
DOMElements.groupCheck.change(function () {
    $('.user-check').prop('checked', this.checked)
})

/**
 * Handle OK control action.
 * @param {number} controlsNumber - The number of controls.
 */
async function handleOkControl(controlsNumber) {
    await new GroupActions(controlsNumber).okClicked()
}

/**
 * Handle user deletion action.
 * @param {string} id - The user ID.
 */
async function handleUserDeletion(id) {
    const user = await UserActions.findUser(id)

    await ModalActions.fillAndShowConfirmModal(
        'Deleting user confirmation',
        'Delete user',
        `Are you sure you want to delete ${user.first_name} ${user.last_name}?`,
        async () => await UserActions.deleteUser(id)
    )
}
