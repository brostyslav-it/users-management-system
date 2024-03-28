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
    static checkboxesSelected() {
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
     * Get user row template asynchronously.
     * @returns {Promise<string>} - Promise resolving to user row template HTML.
     */
    static async getUserRowTemplate() {
        return (await $.get('/templates/user-row.html'))
    }

    /**
     * Create user row asynchronously.
     * @param {Object} user - The user data.
     * @returns {Promise<string>} - Promise resolving to HTML of the user row.
     */
    static async createUserRow(user) {
        return (await DOMElements.userRowTemplate).replace(/{{(\w+)}}/g, (match, key) => user[key])
    }

    /**
     * Create users table asynchronously.
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
 * Class representing DOM elements and their actions.
 */
class DOMElements {
    /**
     * User row template element.
     * @type {Promise}
     */
    static userRowTemplate = DOMActions.getUserRowTemplate()

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
            status: $('#status').prop('checked') ? true : '',
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
     * @param {jQuery|null} caller - The calling element.
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
        await ModalActions.fillConfirmModal(
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
        }, DOMElements.confirmModal)
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
     * Get users asynchronously.
     * @returns {Promise<Array>} - Promise resolving to array of users.
     */
    static async getUsers() {
        return (await $.getJSON('/users')).users
    }

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
            DOMElements.userModal.modal('hide')
            DOMActions.updateUserFormInputs('', '', false, '')
            $('#users-table > tbody').append(await DOMActions.createUserRow({
                ...user,
                color: Utils.getActiveColor(user.status),
                id: res.id
            }))
        }, DOMElements.userModal)
    }

    /**
     * Update user asynchronously.
     * @param {string} id - The user ID.
     */
    static async updateUser(id) {
        const user = Utils.createUser(id)

        RequestHandler.handleRequest(await $.post(`/update`, user), () => {
            DOMElements.userModal.modal('hide')
            DOMActions.updateUserFormInputs('', '', false, '')

            const userRow = $(`#user-${user.id}`)

            userRow.find('.user-name').text(`${user.first_name} ${user.last_name}`)
            userRow.find('.user-role').text(user.role)
            userRow.find('.user-active').attr('fill', Utils.getActiveColor(user.status))
        }, DOMElements.userModal)
    }

    /**
     * Delete user asynchronously.
     * @param {string} id - The user ID.
     */
    static async deleteUser(id) {
        RequestHandler.handleRequest(await $.post('/delete', {id: [id]}), () => {
            DOMElements.confirmModal.modal('hide')
            $(`#user-${id}`).remove()
        }, DOMElements.confirmModal)
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
     * @param {jQuery|null} caller - The calling element.
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
     * Show user modal.
     * @param {object} e - The event object.
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
     * Fill confirm modal.
     * @param {string} labelText - The label text.
     * @param {string} btnText - The button text.
     * @param {string} bodyText - The body text.
     * @param {Function} clickFunction - The function to execute on click.
     */
    static async fillConfirmModal(labelText, btnText, bodyText, clickFunction) {
        DOMElements.confirmModal.modal('show')
        DOMElements.confirmModalBtn.off('click')

        DOMElements.confirmModalLabel.text(labelText)
        DOMElements.confirmModalBtn.text(btnText)

        DOMElements.confirmModalBody.text(bodyText)

        DOMElements.confirmModalBtn.click(clickFunction)
    }
}

/**
 * Initialize users table on window load.
 */
window.onload = DOMActions.createUsersTable

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

    await ModalActions.fillConfirmModal(
        'Deleting user confirmation',
        'Delete user',
        `Are you sure you want to delete ${user.first_name} ${user.last_name}?`,
        async () => await UserActions.deleteUser(id)
    )
}
