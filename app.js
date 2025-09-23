/**
 * To-Do List Application
 * Educational project demonstrating vanilla JavaScript, DOM manipulation, and localStorage
 */

// Educational Note: Use strict mode for better error checking and modern JavaScript features
'use strict';

/**
 * Application State
 * Educational Note: Centralized state makes the app easier to debug and maintain
 */
const appState = {
    tasks: [],           // Array to hold all tasks
    currentFilter: 'all', // Current filter: 'all', 'active', 'completed'
    editingTaskId: null  // ID of task currently being edited
};

/**
 * Task Class
 * Educational Note: Classes provide a template for creating objects with similar structure
 */
class Task {
    constructor(text) {
        // Validate input text
        if (!this.isValidText(text)) {
            throw new Error('Task text must be a non-empty string with maximum 500 characters');
        }

        // Educational Note: Date.now() generates unique timestamps that can serve as IDs
        this.id = 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        this.text = text.trim(); // Remove leading/trailing whitespace
        this.completed = false;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    /**
     * Validate task text
     * Educational Note: Static methods belong to the class, not instances
     */
    static isValidText(text) {
        return typeof text === 'string' &&
               text.trim().length > 0 &&
               text.trim().length <= 500;
    }

    /**
     * Instance method to validate text (for convenience)
     */
    isValidText(text) {
        return Task.isValidText(text);
    }

    // Educational Note: Methods are functions that belong to a class
    toggle() {
        this.completed = !this.completed;
        this.updatedAt = new Date().toISOString();
        return this; // Return self for method chaining
    }

    updateText(newText) {
        if (!this.isValidText(newText)) {
            throw new Error('Invalid text: must be non-empty string with maximum 500 characters');
        }
        this.text = newText.trim();
        this.updatedAt = new Date().toISOString();
        return this; // Return self for method chaining
    }

    /**
     * Convert task to plain object for storage
     * Educational Note: This helps with JSON serialization
     */
    toObject() {
        return {
            id: this.id,
            text: this.text,
            completed: this.completed,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Create Task from plain object (for loading from storage)
     * Educational Note: Static factory method
     */
    static fromObject(obj) {
        const task = Object.create(Task.prototype);
        task.id = obj.id;
        task.text = obj.text;
        task.completed = obj.completed;
        task.createdAt = obj.createdAt;
        task.updatedAt = obj.updatedAt;
        return task;
    }
}

/**
 * TaskList Class
 * Educational Note: This class manages the collection of tasks and business logic
 */
class TaskList {
    constructor() {
        this.tasks = [];
    }

    // CRUD Operations - Core functionality

    /**
     * Add new task to the list
     * Educational Note: Create operation of CRUD
     */
    addTask(text) {
        try {
            // Validate text before creating task
            if (!Task.isValidText(text)) {
                console.warn('addTask: Invalid text provided');
                return null;
            }

            const task = new Task(text);
            this.tasks.push(task);

            // Auto-save to storage (will be implemented in Phase 3.4)
            this.saveToStorage();

            // Auto-render (will be implemented in T017)
            this.renderTasks();

            console.log('Task added:', task.text);
            return task;
        } catch (error) {
            console.error('Error adding task:', error.message);
            return null;
        }
    }

    /**
     * Delete task by ID
     * Educational Note: Delete operation of CRUD
     */
    deleteTask(id) {
        try {
            const initialLength = this.tasks.length;
            this.tasks = this.tasks.filter(task => task.id !== id);

            const deleted = this.tasks.length < initialLength;
            if (deleted) {
                // Auto-save to storage (will be implemented in Phase 3.4)
                this.saveToStorage();

                // Auto-render (will be implemented in T017)
                this.renderTasks();

                console.log('Task deleted:', id);
            } else {
                console.warn('Task not found for deletion:', id);
            }

            return deleted;
        } catch (error) {
            console.error('Error deleting task:', error.message);
            return false;
        }
    }

    /**
     * Toggle task completion status
     * Educational Note: Update operation of CRUD
     */
    toggleTask(id) {
        try {
            const task = this.tasks.find(t => t.id === id);

            if (!task) {
                console.warn('Task not found for toggle:', id);
                return null;
            }

            task.toggle();

            // Auto-save to storage (will be implemented in Phase 3.4)
            this.saveToStorage();

            // Auto-render (will be implemented in T017)
            this.renderTasks();

            console.log('Task toggled:', task.text, 'completed:', task.completed);
            return task;
        } catch (error) {
            console.error('Error toggling task:', error.message);
            return null;
        }
    }

    /**
     * Edit task text
     * Educational Note: Update operation of CRUD
     */
    editTask(id, newText) {
        try {
            const task = this.tasks.find(t => t.id === id);

            if (!task) {
                console.warn('Task not found for edit:', id);
                return null;
            }

            task.updateText(newText);
            console.log('Task edited:', task.text);
            return task;
        } catch (error) {
            console.error('Error editing task:', error.message);
            return null;
        }
    }

    /**
     * Get all tasks
     * Educational Note: Read operation of CRUD
     */
    getAllTasks() {
        return [...this.tasks]; // Return copy to prevent external modification
    }

    /**
     * Get filtered tasks based on completion status
     */
    getFilteredTasks(filter = 'all') {
        switch (filter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            case 'all':
            default:
                return [...this.tasks];
        }
    }

    /**
     * Render tasks to the DOM
     * Educational Note: This method updates the user interface
     */
    renderTasks() {
        try {
            const taskList = document.getElementById('task-list');
            const taskCount = document.getElementById('task-count');

            if (!taskList || !taskCount) {
                console.warn('Required DOM elements not found');
                return;
            }

            // Get tasks based on current filter
            const filteredTasks = this.getFilteredTasks(appState.currentFilter);

            // Clear existing tasks
            taskList.innerHTML = '';

            // Update task counter with detailed statistics
            this.updateTaskCounter();

            // Render each task
            if (filteredTasks.length === 0) {
                const emptyMessage = document.createElement('li');
                emptyMessage.className = 'empty-state';
                emptyMessage.textContent = this.getEmptyMessage();
                taskList.appendChild(emptyMessage);
            } else {
                filteredTasks.forEach(task => {
                    const taskElement = this.createTaskElement(task);
                    taskList.appendChild(taskElement);
                });
            }

            console.log(`Rendered ${filteredTasks.length} tasks (filter: ${appState.currentFilter})`);
        } catch (error) {
            console.error('Error rendering tasks:', error.message);
        }
    }

    /**
     * Create DOM element for a single task
     * Educational Note: This creates the HTML structure for each task
     */
    createTaskElement(task) {
        const listItem = document.createElement('li');
        listItem.className = 'task-item';
        listItem.setAttribute('data-task-id', task.id);

        listItem.innerHTML = `
            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? 'checked' : ''}
                data-task-id="${task.id}"
            >
            <span class="task-text ${task.completed ? 'completed' : ''}">
                ${this.escapeHtml(task.text)}
            </span>
            <div class="task-actions">
                <button class="edit-btn" data-task-id="${task.id}">Edit</button>
                <button class="delete-btn" data-task-id="${task.id}">Delete</button>
            </div>
        `;

        return listItem;
    }

    /**
     * Get empty message based on current filter
     */
    getEmptyMessage() {
        switch (appState.currentFilter) {
            case 'active':
                return 'No active tasks! 🎉';
            case 'completed':
                return 'No completed tasks yet.';
            default:
                return 'No tasks yet. Add one above!';
        }
    }

    /**
     * Escape HTML to prevent XSS attacks
     * Educational Note: Always sanitize user input before displaying
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Save tasks to localStorage
     * Educational Note: Persist data between browser sessions
     */
    saveToStorage() {
        try {
            // Check if localStorage is available
            if (typeof Storage === 'undefined' || !localStorage) {
                console.warn('localStorage not available');
                return false;
            }

            // Prepare data for storage
            const dataToSave = {
                tasks: this.tasks.map(task => task.toObject()),
                version: '1.0.0',
                lastSaved: new Date().toISOString(),
                settings: {
                    currentFilter: appState.currentFilter
                }
            };

            // Save to localStorage
            localStorage.setItem('todoApp', JSON.stringify(dataToSave));

            console.log(`Saved ${this.tasks.length} tasks to localStorage`);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error.message);

            // Handle quota exceeded or other storage errors
            if (error.name === 'QuotaExceededError') {
                console.warn('localStorage quota exceeded - cannot save tasks');
                // Could show user notification here
            }

            return false;
        }
    }

    /**
     * Load tasks from localStorage
     * Educational Note: Restore data when app loads
     */
    loadFromStorage() {
        try {
            // Check if localStorage is available
            if (typeof Storage === 'undefined' || !localStorage) {
                console.warn('localStorage not available');
                return false;
            }

            // Get data from localStorage
            const storedData = localStorage.getItem('todoApp');

            if (!storedData) {
                console.log('No stored data found - starting with empty task list');
                return true; // Not an error, just no data yet
            }

            // Parse stored data
            const parsedData = JSON.parse(storedData);

            // Validate data structure
            if (!parsedData || !Array.isArray(parsedData.tasks)) {
                console.warn('Invalid stored data structure');
                return false;
            }

            // Restore tasks
            this.tasks = parsedData.tasks.map(taskData => Task.fromObject(taskData));

            // Restore settings if available
            if (parsedData.settings) {
                appState.currentFilter = parsedData.settings.currentFilter || 'all';
                this.updateFilterButtons();
            }

            console.log(`Loaded ${this.tasks.length} tasks from localStorage`);
            console.log(`Data version: ${parsedData.version}, saved: ${parsedData.lastSaved}`);

            return true;
        } catch (error) {
            console.error('Error loading from localStorage:', error.message);

            // Handle corrupted data
            if (error instanceof SyntaxError) {
                console.warn('Corrupted localStorage data - clearing and starting fresh');
                localStorage.removeItem('todoApp');
            }

            return false;
        }
    }

    /**
     * Update task counter with detailed statistics
     * Educational Note: Provide useful feedback to users
     */
    updateTaskCounter() {
        const taskCount = document.getElementById('task-count');
        if (!taskCount) return;

        const totalTasks = this.tasks.length;
        const activeTasks = this.tasks.filter(t => !t.completed).length;
        const completedTasks = totalTasks - activeTasks;

        // Create detailed counter text based on current filter
        let counterText = '';

        switch (appState.currentFilter) {
            case 'active':
                counterText = activeTasks === 1 ? '1 active task' : `${activeTasks} active tasks`;
                if (totalTasks > activeTasks) {
                    counterText += ` (${completedTasks} completed)`;
                }
                break;

            case 'completed':
                counterText = completedTasks === 1 ? '1 completed task' : `${completedTasks} completed tasks`;
                if (activeTasks > 0) {
                    counterText += ` (${activeTasks} remaining)`;
                }
                break;

            case 'all':
            default:
                if (totalTasks === 0) {
                    counterText = 'No tasks yet';
                } else if (totalTasks === 1) {
                    counterText = '1 task';
                } else {
                    counterText = `${totalTasks} tasks`;
                }

                // Add breakdown if there are both types
                if (activeTasks > 0 && completedTasks > 0) {
                    counterText += ` (${activeTasks} active, ${completedTasks} completed)`;
                } else if (completedTasks > 0) {
                    counterText += ' (all completed)';
                }
                break;
        }

        taskCount.textContent = counterText;
    }

    /**
     * Update filter button states
     * Educational Note: Visual feedback for current filter
     */
    updateFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(button => {
            const filter = button.getAttribute('data-filter');
            if (filter === appState.currentFilter) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    /**
     * Show user feedback message
     * Educational Note: User interface feedback for actions
     */
    showMessage(message, type = 'info', duration = 3000) {
        // Remove any existing message
        const existingMessage = document.querySelector('.user-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `user-message user-message-${type}`;
        messageElement.textContent = message;

        // Add to DOM
        const main = document.querySelector('main');
        if (main) {
            main.insertBefore(messageElement, main.firstChild);

            // Auto-remove after duration
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, duration);
        }
    }

    /**
     * Handle application errors gracefully
     * Educational Note: Error boundaries and user experience
     */
    handleError(error, context = 'Unknown') {
        console.error(`Error in ${context}:`, error);

        // Show user-friendly error message
        let userMessage = 'Something went wrong. ';

        if (error.name === 'QuotaExceededError') {
            userMessage = 'Storage is full. Some features may not work.';
        } else if (error.message.includes('localStorage')) {
            userMessage = 'Unable to save changes. Check your browser settings.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            userMessage = 'Network error. Please check your connection.';
        } else {
            userMessage += 'Please refresh the page and try again.';
        }

        this.showMessage(userMessage, 'error', 5000);
    }
}

/**
 * Application Instance
 * Educational Note: Create a global instance that can be accessed throughout the app
 */
let todoApp = null;

/**
 * DOM Ready Handler
 * Educational Note: Wait for DOM to be fully loaded before running JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('To-Do App: DOM loaded, initializing application...');

    // Initialize the application
    todoApp = new TaskList();

    // Educational Note: Try to load existing tasks from localStorage
    try {
        todoApp.loadFromStorage();
        console.log('To-Do App: Successfully loaded from localStorage');
    } catch (error) {
        console.warn('To-Do App: Could not load from localStorage:', error.message);
    }

    // Set up event handlers
    setupEventHandlers();

    // Educational Note: Render initial state
    todoApp.renderTasks();

    console.log('To-Do App: Initialization complete');
});

/**
 * Set up event handlers for UI interactions
 * Educational Note: Event delegation and form handling
 */
function setupEventHandlers() {
    // Form submission for adding tasks
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
        taskForm.addEventListener('submit', handleAddTask);
    }

    // Task list interactions (using event delegation)
    const taskList = document.getElementById('task-list');
    if (taskList) {
        taskList.addEventListener('click', handleTaskListClick);
        taskList.addEventListener('change', handleTaskListChange);
    }

    // Filter button interactions
    const filterControls = document.querySelector('.filter-controls');
    if (filterControls) {
        filterControls.addEventListener('click', handleFilterClick);
    }

    // Clear completed button
    const clearCompletedBtn = document.getElementById('clear-completed');
    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', handleClearCompleted);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    console.log('Event handlers set up successfully');
}

/**
 * Handle task form submission
 * Educational Note: Form validation and prevention of default behavior
 */
function handleAddTask(event) {
    event.preventDefault(); // Prevent form submission

    const taskInput = document.getElementById('task-input');
    if (!taskInput) return;

    const taskText = taskInput.value.trim();

    if (taskText) {
        const success = todoApp.addTask(taskText);
        if (success) {
            taskInput.value = ''; // Clear input on success
            taskInput.focus(); // Keep focus for next task
            todoApp.showMessage('Task added successfully!', 'success', 2000);
        } else {
            todoApp.showMessage('Failed to add task. Please check your input.', 'error');
        }
    }
}

/**
 * Handle clicks in task list
 * Educational Note: Event delegation for dynamic content
 */
function handleTaskListClick(event) {
    const target = event.target;
    const taskId = target.getAttribute('data-task-id');

    if (!taskId) return;

    if (target.classList.contains('delete-btn')) {
        todoApp.deleteTask(taskId);
    } else if (target.classList.contains('edit-btn')) {
        handleEditTask(taskId);
    }
}

/**
 * Handle changes in task list (checkboxes)
 */
function handleTaskListChange(event) {
    const target = event.target;

    if (target.classList.contains('task-checkbox')) {
        const taskId = target.getAttribute('data-task-id');
        if (taskId) {
            todoApp.toggleTask(taskId);
        }
    }
}

/**
 * Handle filter button clicks
 */
function handleFilterClick(event) {
    const target = event.target;

    if (target.classList.contains('filter-btn')) {
        const filter = target.getAttribute('data-filter');
        if (filter) {
            appState.currentFilter = filter;
            todoApp.updateFilterButtons();
            todoApp.renderTasks();
            todoApp.saveToStorage(); // Save filter preference
        }
    }
}

/**
 * Handle clear completed button
 */
function handleClearCompleted() {
    const completedTasks = todoApp.tasks.filter(task => task.completed);

    if (completedTasks.length === 0) {
        console.log('No completed tasks to clear');
        return;
    }

    // Confirm with user (basic confirmation)
    if (confirm(`Clear ${completedTasks.length} completed tasks?`)) {
        completedTasks.forEach(task => {
            todoApp.deleteTask(task.id);
        });
        console.log(`Cleared ${completedTasks.length} completed tasks`);
    }
}

/**
 * Handle edit task - now fully implemented
 */
function handleEditTask(taskId) {
    const task = todoApp.tasks.find(t => t.id === taskId);
    if (!task) return;

    // Find the task element
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (!taskElement) return;

    // Set editing state
    appState.editingTaskId = taskId;

    // Get the text span
    const textSpan = taskElement.querySelector('.task-text');
    const currentText = task.text;

    // Create edit input
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'task-edit-input';
    editInput.value = currentText;
    editInput.maxLength = 500;

    // Replace text with input
    textSpan.style.display = 'none';
    textSpan.parentNode.insertBefore(editInput, textSpan.nextSibling);

    // Update action buttons
    const actionsDiv = taskElement.querySelector('.task-actions');
    actionsDiv.innerHTML = `
        <button class="save-btn" data-task-id="${taskId}">Save</button>
        <button class="cancel-btn" data-task-id="${taskId}">Cancel</button>
    `;

    // Focus and select input
    editInput.focus();
    editInput.select();

    // Handle save/cancel
    actionsDiv.addEventListener('click', function(e) {
        if (e.target.classList.contains('save-btn')) {
            saveTaskEdit(taskId, editInput.value.trim());
        } else if (e.target.classList.contains('cancel-btn')) {
            cancelTaskEdit(taskId);
        }
    });

    // Handle Enter/Escape keys
    editInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            saveTaskEdit(taskId, editInput.value.trim());
        } else if (e.key === 'Escape') {
            cancelTaskEdit(taskId);
        }
    });
}

/**
 * Save task edit
 */
function saveTaskEdit(taskId, newText) {
    if (!newText) {
        todoApp.showMessage('Task text cannot be empty', 'warning');
        return;
    }

    const success = todoApp.editTask(taskId, newText);
    if (success) {
        appState.editingTaskId = null;
        todoApp.renderTasks();
        todoApp.showMessage('Task updated successfully!', 'success', 2000);
    } else {
        todoApp.showMessage('Failed to update task', 'error');
    }
}

/**
 * Cancel task edit
 */
function cancelTaskEdit(taskId) {
    appState.editingTaskId = null;
    todoApp.renderTasks();
}

/**
 * Handle keyboard shortcuts
 * Educational Note: Accessibility and power user features
 */
function handleKeyboardShortcuts(event) {
    // Only handle shortcuts when not in input fields
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }

    switch (event.key) {
        case 'n':
        case 'N':
            // Focus on new task input
            const taskInput = document.getElementById('task-input');
            if (taskInput) {
                taskInput.focus();
            }
            break;

        case '1':
            // Show all tasks
            appState.currentFilter = 'all';
            todoApp.updateFilterButtons();
            todoApp.renderTasks();
            break;

        case '2':
            // Show active tasks
            appState.currentFilter = 'active';
            todoApp.updateFilterButtons();
            todoApp.renderTasks();
            break;

        case '3':
            // Show completed tasks
            appState.currentFilter = 'completed';
            todoApp.updateFilterButtons();
            todoApp.renderTasks();
            break;
    }
}

/**
 * Test Functions Section
 * Educational Note: These test functions validate our implementation follows TDD principles
 */

/**
 * Test Suite for TaskListAPI.addTask()
 * Educational Note: These tests must FAIL initially, then pass after implementation
 */
function testAddTask() {
    console.log('=== Testing addTask() functionality ===');
    let testsPassed = 0;
    let testsTotal = 0;

    // Test 1: Basic task addition
    testsTotal++;
    try {
        const initialCount = todoApp.tasks.length;
        const result = todoApp.addTask('Test task');
        const newCount = todoApp.tasks.length;

        if (newCount === initialCount + 1 && result && result.text === 'Test task') {
            console.log('✅ Test 1 PASSED: Basic task addition works');
            testsPassed++;
        } else {
            console.log('❌ Test 1 FAILED: Basic task addition failed');
        }
    } catch (error) {
        console.log('❌ Test 1 FAILED: Exception thrown:', error.message);
    }

    // Test 2: Empty text validation
    testsTotal++;
    try {
        const initialCount = todoApp.tasks.length;
        const result = todoApp.addTask('');
        const newCount = todoApp.tasks.length;

        if (newCount === initialCount && !result) {
            console.log('✅ Test 2 PASSED: Empty text rejected');
            testsPassed++;
        } else {
            console.log('❌ Test 2 FAILED: Empty text was accepted');
        }
    } catch (error) {
        console.log('❌ Test 2 FAILED: Exception thrown:', error.message);
    }

    // Test 3: Whitespace-only text validation
    testsTotal++;
    try {
        const initialCount = todoApp.tasks.length;
        const result = todoApp.addTask('   \t\n   ');
        const newCount = todoApp.tasks.length;

        if (newCount === initialCount && !result) {
            console.log('✅ Test 3 PASSED: Whitespace-only text rejected');
            testsPassed++;
        } else {
            console.log('❌ Test 3 FAILED: Whitespace-only text was accepted');
        }
    } catch (error) {
        console.log('❌ Test 3 FAILED: Exception thrown:', error.message);
    }

    // Test 4: Long text handling (500+ characters)
    testsTotal++;
    try {
        const longText = 'A'.repeat(600); // 600 characters
        const initialCount = todoApp.tasks.length;
        const result = todoApp.addTask(longText);
        const newCount = todoApp.tasks.length;

        // Should either reject or truncate
        if (result && result.text.length <= 500) {
            console.log('✅ Test 4 PASSED: Long text handled correctly (truncated)');
            testsPassed++;
        } else if (newCount === initialCount && !result) {
            console.log('✅ Test 4 PASSED: Long text rejected');
            testsPassed++;
        } else {
            console.log('❌ Test 4 FAILED: Long text not handled properly');
        }
    } catch (error) {
        console.log('❌ Test 4 FAILED: Exception thrown:', error.message);
    }

    // Test 5: Task object structure validation
    testsTotal++;
    try {
        const result = todoApp.addTask('Structure test');

        if (result &&
            typeof result.id === 'string' &&
            typeof result.text === 'string' &&
            typeof result.completed === 'boolean' &&
            typeof result.createdAt === 'string' &&
            typeof result.updatedAt === 'string') {
            console.log('✅ Test 5 PASSED: Task object has correct structure');
            testsPassed++;
        } else {
            console.log('❌ Test 5 FAILED: Task object structure incorrect');
        }
    } catch (error) {
        console.log('❌ Test 5 FAILED: Exception thrown:', error.message);
    }

    console.log(`addTask() Tests: ${testsPassed}/${testsTotal} passed`);
    return { passed: testsPassed, total: testsTotal };
}

/**
 * Test Suite for TaskListAPI.toggleTask()
 * Educational Note: Test task completion toggling functionality
 */
function testToggleTask() {
    console.log('=== Testing toggleTask() functionality ===');
    let testsPassed = 0;
    let testsTotal = 0;

    // Setup: Add a test task first
    const setupTask = todoApp.addTask('Toggle test task');
    const taskId = setupTask ? setupTask.id : null;

    if (!taskId) {
        console.log('❌ Toggle tests SKIPPED: Cannot add setup task');
        return { passed: 0, total: 0 };
    }

    // Test 1: Toggle from incomplete to complete
    testsTotal++;
    try {
        const task = todoApp.tasks.find(t => t.id === taskId);
        const initialState = task.completed;
        const result = todoApp.toggleTask(taskId);

        if (result && result.completed !== initialState) {
            console.log('✅ Test 1 PASSED: Task toggled to completed');
            testsPassed++;
        } else {
            console.log('❌ Test 1 FAILED: Task completion state not changed');
        }
    } catch (error) {
        console.log('❌ Test 1 FAILED: Exception thrown:', error.message);
    }

    // Test 2: Toggle back to incomplete
    testsTotal++;
    try {
        const task = todoApp.tasks.find(t => t.id === taskId);
        const initialState = task.completed;
        const result = todoApp.toggleTask(taskId);

        if (result && result.completed !== initialState) {
            console.log('✅ Test 2 PASSED: Task toggled back to incomplete');
            testsPassed++;
        } else {
            console.log('❌ Test 2 FAILED: Task completion state not changed back');
        }
    } catch (error) {
        console.log('❌ Test 2 FAILED: Exception thrown:', error.message);
    }

    // Test 3: Invalid task ID handling
    testsTotal++;
    try {
        const result = todoApp.toggleTask('invalid_id_12345');

        if (!result) {
            console.log('✅ Test 3 PASSED: Invalid ID properly rejected');
            testsPassed++;
        } else {
            console.log('❌ Test 3 FAILED: Invalid ID was not rejected');
        }
    } catch (error) {
        console.log('❌ Test 3 FAILED: Exception thrown:', error.message);
    }

    // Test 4: updatedAt timestamp modification
    testsTotal++;
    try {
        const task = todoApp.tasks.find(t => t.id === taskId);
        const originalUpdatedAt = task.updatedAt;

        // Wait a moment to ensure timestamp difference
        setTimeout(() => {
            const result = todoApp.toggleTask(taskId);

            if (result && result.updatedAt !== originalUpdatedAt) {
                console.log('✅ Test 4 PASSED: updatedAt timestamp modified');
                testsPassed++;
            } else {
                console.log('❌ Test 4 FAILED: updatedAt timestamp not modified');
            }
        }, 1);
    } catch (error) {
        console.log('❌ Test 4 FAILED: Exception thrown:', error.message);
    }

    console.log(`toggleTask() Tests: ${testsPassed}/${testsTotal} passed`);
    return { passed: testsPassed, total: testsTotal };
}

/**
 * Test Suite for TaskListAPI.deleteTask()
 * Educational Note: Test task deletion functionality
 */
function testDeleteTask() {
    console.log('=== Testing deleteTask() functionality ===');
    let testsPassed = 0;
    let testsTotal = 0;

    // Setup: Add test tasks
    const task1 = todoApp.addTask('Delete test task 1');
    const task2 = todoApp.addTask('Delete test task 2');
    const task3 = todoApp.addTask('Delete test task 3');

    if (!task1 || !task2 || !task3) {
        console.log('❌ Delete tests SKIPPED: Cannot add setup tasks');
        return { passed: 0, total: 0 };
    }

    // Test 1: Basic task deletion
    testsTotal++;
    try {
        const initialCount = todoApp.tasks.length;
        const result = todoApp.deleteTask(task1.id);
        const newCount = todoApp.tasks.length;
        const taskExists = todoApp.tasks.find(t => t.id === task1.id);

        if (result && newCount === initialCount - 1 && !taskExists) {
            console.log('✅ Test 1 PASSED: Task successfully deleted');
            testsPassed++;
        } else {
            console.log('❌ Test 1 FAILED: Task deletion failed');
        }
    } catch (error) {
        console.log('❌ Test 1 FAILED: Exception thrown:', error.message);
    }

    // Test 2: Delete non-existent task
    testsTotal++;
    try {
        const initialCount = todoApp.tasks.length;
        const result = todoApp.deleteTask('invalid_id_12345');
        const newCount = todoApp.tasks.length;

        if (!result && newCount === initialCount) {
            console.log('✅ Test 2 PASSED: Non-existent task properly handled');
            testsPassed++;
        } else {
            console.log('❌ Test 2 FAILED: Non-existent task not handled properly');
        }
    } catch (error) {
        console.log('❌ Test 2 FAILED: Exception thrown:', error.message);
    }

    // Test 3: Delete already deleted task
    testsTotal++;
    try {
        const initialCount = todoApp.tasks.length;
        const result = todoApp.deleteTask(task1.id); // Already deleted in test 1
        const newCount = todoApp.tasks.length;

        if (!result && newCount === initialCount) {
            console.log('✅ Test 3 PASSED: Already deleted task properly handled');
            testsPassed++;
        } else {
            console.log('❌ Test 3 FAILED: Already deleted task not handled properly');
        }
    } catch (error) {
        console.log('❌ Test 3 FAILED: Exception thrown:', error.message);
    }

    // Test 4: Verify other tasks remain unaffected
    testsTotal++;
    try {
        const task2Exists = todoApp.tasks.find(t => t.id === task2.id);
        const task3Exists = todoApp.tasks.find(t => t.id === task3.id);

        if (task2Exists && task3Exists) {
            console.log('✅ Test 4 PASSED: Other tasks remain unaffected');
            testsPassed++;
        } else {
            console.log('❌ Test 4 FAILED: Other tasks were affected');
        }
    } catch (error) {
        console.log('❌ Test 4 FAILED: Exception thrown:', error.message);
    }

    console.log(`deleteTask() Tests: ${testsPassed}/${testsTotal} passed`);
    return { passed: testsPassed, total: testsTotal };
}

/**
 * Test Suite for localStorage persistence
 * Educational Note: Test data saving and loading functionality
 */
function testLocalStoragePersistence() {
    console.log('=== Testing localStorage persistence ===');
    let testsPassed = 0;
    let testsTotal = 0;

    // Test 1: Check localStorage availability
    testsTotal++;
    try {
        const available = typeof Storage !== 'undefined' && localStorage;

        if (available) {
            console.log('✅ Test 1 PASSED: localStorage is available');
            testsPassed++;
        } else {
            console.log('❌ Test 1 FAILED: localStorage is not available');
        }
    } catch (error) {
        console.log('❌ Test 1 FAILED: Exception thrown:', error.message);
    }

    // Test 2: Save to localStorage
    testsTotal++;
    try {
        // Add some test data
        todoApp.addTask('Persistence test task 1');
        todoApp.addTask('Persistence test task 2');

        const result = todoApp.saveToStorage();

        if (result) {
            console.log('✅ Test 2 PASSED: Data saved to localStorage');
            testsPassed++;
        } else {
            console.log('❌ Test 2 FAILED: Data not saved to localStorage');
        }
    } catch (error) {
        console.log('❌ Test 2 FAILED: Exception thrown:', error.message);
    }

    // Test 3: Load from localStorage
    testsTotal++;
    try {
        // Clear current tasks
        todoApp.tasks = [];

        const result = todoApp.loadFromStorage();

        if (result && todoApp.tasks.length > 0) {
            console.log('✅ Test 3 PASSED: Data loaded from localStorage');
            testsPassed++;
        } else {
            console.log('❌ Test 3 FAILED: Data not loaded from localStorage');
        }
    } catch (error) {
        console.log('❌ Test 3 FAILED: Exception thrown:', error.message);
    }

    // Test 4: Data integrity after save/load cycle
    testsTotal++;
    try {
        // Clear and add specific test data
        todoApp.tasks = [];
        const originalTask = todoApp.addTask('Integrity test task');
        todoApp.toggleTask(originalTask.id); // Mark as completed

        // Save and reload
        todoApp.saveToStorage();
        todoApp.tasks = [];
        todoApp.loadFromStorage();

        const loadedTask = todoApp.tasks.find(t => t.text === 'Integrity test task');

        if (loadedTask &&
            loadedTask.id === originalTask.id &&
            loadedTask.completed === true &&
            loadedTask.text === originalTask.text) {
            console.log('✅ Test 4 PASSED: Data integrity maintained');
            testsPassed++;
        } else {
            console.log('❌ Test 4 FAILED: Data integrity compromised');
        }
    } catch (error) {
        console.log('❌ Test 4 FAILED: Exception thrown:', error.message);
    }

    // Test 5: Handle corrupted localStorage data
    testsTotal++;
    try {
        // Simulate corrupted data
        localStorage.setItem('todoApp', 'invalid json data');

        const result = todoApp.loadFromStorage();

        // Should handle gracefully and return empty array or false
        if (!result || todoApp.tasks.length === 0) {
            console.log('✅ Test 5 PASSED: Corrupted data handled gracefully');
            testsPassed++;
        } else {
            console.log('❌ Test 5 FAILED: Corrupted data not handled properly');
        }
    } catch (error) {
        console.log('❌ Test 5 FAILED: Exception thrown:', error.message);
    }

    console.log(`localStorage Tests: ${testsPassed}/${testsTotal} passed`);
    return { passed: testsPassed, total: testsTotal };
}

/**
 * Master Test Runner
 * Educational Note: Runs all test suites and reports overall results
 */
function runAllTests() {
    console.log('🧪 Starting TDD Test Suite - These tests should FAIL initially');
    console.log('='.repeat(60));

    const results = [];

    // Run all test suites
    results.push(testAddTask());
    results.push(testToggleTask());
    results.push(testDeleteTask());
    results.push(testLocalStoragePersistence());

    // Calculate overall results
    const totalPassed = results.reduce((sum, result) => sum + result.passed, 0);
    const totalTests = results.reduce((sum, result) => sum + result.total, 0);

    console.log('='.repeat(60));
    console.log(`📊 Overall Test Results: ${totalPassed}/${totalTests} tests passed`);

    if (totalPassed === 0) {
        console.log('✅ TDD Status: PERFECT! All tests fail as expected before implementation');
    } else if (totalPassed < totalTests) {
        console.log('⚠️ TDD Status: Some tests passing - implementation may be partially complete');
    } else {
        console.log('🎉 TDD Status: All tests pass - implementation is complete!');
    }

    return { passed: totalPassed, total: totalTests };
}