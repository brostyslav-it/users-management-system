/**
 * Utility class for performing actions on the DOM elements.
 */
class DOMActions {
    /**
     * Updates user form inputs with provided data.
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
     * Updates group checkbox based on selected user checkboxes.
     */
    static checkboxesSelected() {
        groupCheck.prop('checked', $('.user-check:checked').length === $('.user-check').length)
    }

    /**
     * Creates error content for displaying in the DOM.
     * @param {string} error - The error message to display.
     * @returns {string} - Error content HTML.
     */
    static createErrorsContent(error) {
        return `<div class="alert alert-danger">${error}</div>`
    }

    /**
     * Retrieves the user row template asynchronously.
     * @returns {Promise<string>} - User row template HTML.
     */
    static async getUserRowTemplate() {
        return (await $.get('/templates/user-row.html'))
    }

    /**
     * Creates a user row based on provided user data.
     * @param {Object} user - The user data object.
     * @returns {Promise<string>} - Created user row HTML.
     */
    static async createUserRow(user) {
        return (await userRowTemplate).replace(/{{(\w+)}}/g, (match, key) => user[key])
    }

    /**
     * Creates users table and appends to the DOM.
     */
    static async createUsersTable() {
        for (const user of await UserActions.getUsers()) {
            $('#users-table > tbody').append(await DOMActions.createUserRow({
                ...user,
                color: Utils.getActiveColor(user.status)
            }))
        }
    }
}

/**
 * Template for user row in the DOM.
 * @type {Promise<string>}
 */
const userRowTemplate = DOMActions.getUserRowTemplate()

window.onload = DOMActions.createUsersTable

/**
 * Modal for adding or updating users.
 * @type {jQuery}
 */
const userModal = $('#user-modal')

/**
 * Modal for confirming user deletion.
 * @type {jQuery}
 */
const deleteModal = $('#delete-modal')

/**
 * Checkbox for selecting/deselecting all user checkboxes.
 * @type {jQuery}
 */
const groupCheck = $('#group-check')

/**
 * Handles 'ok' button control for a group of elements.
 * @param {number} controlsNumber - Number of controls.
 */
async function handleOkControl(controlsNumber) {
    await new GroupActions(controlsNumber).okClicked()
}

/**
 * Represents utility functions for common tasks.
 */
class Utils {
    /**
     * Creates a user object from form inputs.
     * @param {number|null} id - The user ID (optional).
     * @returns {Object} - Created user object.
     */
    static createUser(id = null) {
        const user = {
            first_name: $('#first-name').val().trim(),
            last_name: $('#last-name').val().trim(),
            status: $('#status').prop('checked') ? true : '',
            role: $('#role').val().trim()
        }

        if (id !== null) {
            user.id = id
        }

        return user
    }

    /**
     * Retrieves active color based on user status.
     * @param {boolean} status - The status of the user.
     * @returns {string} - Color string.
     */
    static getActiveColor(status) {
        return status ? 'green' : 'gray'
    }
}

/**
 * Handles HTTP requests and responses.
 */
class RequestHandler {
    /**
     * Handles HTTP request response.
     * @param {Object} response - The HTTP response object.
     * @param {Function} successFunction - Success callback function.
     * @param {jQuery|null} caller - Caller modal (optional).
     */
    static handleRequest(response, successFunction, caller = null) {
        if (caller !== null) {
            caller.modal('hide')
        }

        if (!response.status) {
            ModalActions.showErrorModal(response.error.message, caller)
            return
        }

        successFunction()
    }
}

/**
 * Represents actions related to groups of users.
 */
class GroupActions {
    /**
     * Initializes GroupActions with number of controls.
     * @param {number} controlsNumber - Number of controls.
     */
    constructor(controlsNumber) {
        this.controlsNumber = controlsNumber
        this.action = $(`#action-select-${this.controlsNumber}`).val()
        this.checkedUsers = $('.user-check:checked')
        this.checkedUsersId = this.getCheckedUsersId()
    }

    /**
     * Retrieves IDs of checked users.
     * @returns {Array} - Array of checked user IDs.
     */
    getCheckedUsersId() {
        return this.checkedUsers.get().map(el => el.value)
    }

    /**
     * Handles 'ok' button click action.
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
     * Handles action based on selected action.
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
                await this.deleteUsers()
                break;

            default:
                ModalActions.showErrorModal('Choose action and users')
        }
    }

    /**
     * Sets selected users active.
     */
    async setUsersActive() {
        RequestHandler.handleRequest(await $.post('/update-status', {
            id: this.checkedUsersId,
            status: true
        }), () => this.changeCheckedUsersStatus(true))
    }

    /**
     * Sets selected users not active.
     */
    async setUsersNotActive() {
        RequestHandler.handleRequest(await $.post('/update-status', {
            id: this.checkedUsersId,
            status: ''
        }), () => this.changeCheckedUsersStatus(false))
    }

    /**
     * Deletes selected users.
     */
    async deleteUsers() {
        RequestHandler.handleRequest(await $.post('/delete', {id: this.checkedUsersId}), () => {
            this.checkedUsers.each(function () {
                $(this).parent().parent().remove()
                groupCheck.prop('checked', false)
            })
        })
    }

    /**
     * Changes status of checked users.
     * @param {boolean} status - New status.
     */
    changeCheckedUsersStatus(status) {
        this.checkedUsers.each(function () {
            $(this).parent().parent().find('.user-active').attr('fill', Utils.getActiveColor(status))
        })
    }
}

/**
 * Handles group checkbox change event.
 */
groupCheck.change(function () {
    $('.user-check').prop('checked', this.checked)
})

/**
 * Represents actions related to individual users.
 */
class UserActions {
    /**
     * Retrieves list of users.
     * @returns {Promise<Array>} - Array of user objects.
     */
    static async getUsers() {
        return (await $.getJSON('/users')).users
    }

    /**
     * Finds user by ID.
     * @param {number} id - The ID of the user to find.
     * @returns {Promise<Object>} - User object.
     */
    static async findUser(id) {
        return (await $.getJSON(`/user/${id}`)).user
    }

    /**
     * Adds a new user.
     */
    static async addUser() {
        const user = Utils.createUser()
        const res = await $.post(`/add`, user)

        RequestHandler.handleRequest(res, async () => {
            userModal.modal('hide')
            DOMActions.updateUserFormInputs('', '', false, '')
            $('#users-table > tbody').append(await DOMActions.createUserRow({
                ...user,
                color: Utils.getActiveColor(user.status),
                id: res.id
            }))
        }, userModal)
    }

    /**
     * Updates an existing user.
     * @param {number} id - The ID of the user to update.
     */
    static async updateUser(id) {
        const user = Utils.createUser(id)

        RequestHandler.handleRequest(await $.post(`/update`, user), () => {
            userModal.modal('hide')
            DOMActions.updateUserFormInputs('', '', false, '')

            const userRow = $(`#user-${user.id}`)

            userRow.find('.user-name').text(`${user.first_name} ${user.last_name}`)
            userRow.find('.user-role').text(user.role)
            userRow.find('.user-active').attr('fill', Utils.getActiveColor(user.status))
        }, userModal)
    }

    /**
     * Deletes a user.
     * @param {number} id - The ID of the user to delete.
     */
    static async deleteUser(id) {
        RequestHandler.handleRequest(await $.post('/delete', {id}), () => {
            deleteModal.modal('hide')
            $(`#user-${id}`).remove()
        }, deleteModal)
    }
}

/**
 * Represents actions related to modals.
 */
class ModalActions {
    /** @type {jQuery} */
    static errorsArea = $('#errors-area')

    /**
     * Shows error modal.
     * @param {string} error - The error message.
     * @param {jQuery|null} caller - Caller modal (optional).
     */
    static showErrorModal(error, caller = null) {
        $('#error-modal').modal('show')

        if (caller !== null) {
            $('#error-ok-btn').click(() => caller.modal('show'))
        }

        this.errorsArea.empty()
        this.errorsArea.append(DOMActions.createErrorsContent(error))
    }

    /**
     * Handles user modal showing event.
     * @param {jQuery.Event} e - The event object.
     */
    static async userModalShowed(e) {
        if (e.relatedTarget === undefined) {
            return
        }

        const action = $(e.relatedTarget).data('action')
        const actionText = action.charAt(0).toUpperCase() + action.slice(1)
        const modalActionButton = $('#modal-action')

        $('#modal-title').text(`${actionText} user`)
        modalActionButton.off('click')
        modalActionButton.text(actionText)

        if (action === 'update') {
            const user = await UserActions.findUser($(e.relatedTarget).data('id'))
            DOMActions.updateUserFormInputs(user.first_name, user.last_name, user.status, user.role)
            modalActionButton.click(() => UserActions.updateUser(user.id))
            return
        }

        modalActionButton.click(() => UserActions.addUser())
    }

    /**
     * Handles delete modal showing event.
     * @param {jQuery.Event} e - The event object.
     */
    static async deleteModalShowed(e) {
        if (e.relatedTarget === undefined) {
            return
        }

        const id = $(e.relatedTarget).data('id')
        const user = await UserActions.findUser(id)
        const deleteUserBtn = $('#delete-user-btn')

        $('#delete-modal-body').text(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)
        deleteUserBtn.off('click')
        deleteUserBtn.on('click', () => UserActions.deleteUser([id]))
    }
}

userModal.on('show.bs.modal', (e) => ModalActions.userModalShowed(e))
deleteModal.on('show.bs.modal', (e) => ModalActions.deleteModalShowed(e))
