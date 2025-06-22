        // Initialize habits with sample data
        let habits = [
            { id: 1, name: "Reading", completed: false, createdAt: Date.now() - 86400000 },
            { id: 2, name: "Exercise", completed: true, createdAt: Date.now() - 172800000 },
            { id: 3, name: "Meditation", completed: false, createdAt: Date.now() - 259200000 },
            { id: 4, name: "Drink Water", completed: false, createdAt: Date.now() - 345600000 }
        ];

        // DOM elements
        const habitsList = document.getElementById('habits-list');
        const addHabitBtn = document.getElementById('add-habit');
        const clearCompletedBtn = document.getElementById('clear-completed');
        const habitsForm = document.getElementById('habits-form');
        const habitInput = document.getElementById('habit-name');
        const summaryText = document.getElementById('summary-text');
        const progressBar = document.getElementById('progress-bar');
        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');
        const filterButtons = document.querySelectorAll('.filter-btn');

        // Stats elements
        const totalHabitsEl = document.getElementById('total-habits');
        const completedHabitsEl = document.getElementById('completed-habits');
        const completionRateEl = document.getElementById('completion-rate');

        // Alert elements
        const removeAlertOverlay = document.getElementById('remove-alert-overlay');
        const removeAlertCancel = document.getElementById('remove-alert-cancel');
        const removeAlertConfirm = document.getElementById('remove-alert-confirm');
        const emptyAlertOverlay = document.getElementById('empty-alert-overlay');
        const emptyAlertOk = document.getElementById('empty-alert-ok');
        const clearAlertOverlay = document.getElementById('clear-alert-overlay');
        const clearAlertCancel = document.getElementById('clear-alert-cancel');
        const clearAlertConfirm = document.getElementById('clear-alert-confirm');

        let pendingRemoveId = null;
        let currentFilter = 'all';
        let currentSort = 'newest';

        function getFilteredAndSortedHabits() {
            let filtered = habits.slice();
            const searchTerm = searchInput.value.toLowerCase().trim();

            // Apply search filter
            if (searchTerm) {
                filtered = filtered.filter(habit => 
                    habit.name.toLowerCase().includes(searchTerm)
                );
            }

            // Apply status filter
            if (currentFilter === 'completed') {
                filtered = filtered.filter(habit => habit.completed);
            } else if (currentFilter === 'pending') {
                filtered = filtered.filter(habit => !habit.completed);
            }

            // Apply sorting
            switch (currentSort) {
                case 'newest':
                    filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                    break;
                case 'oldest':
                    filtered.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
                    break;
                case 'alphabetical':
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'reverse-alphabetical':
                    filtered.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'completed-first':
                    filtered.sort((a, b) => b.completed - a.completed);
                    break;
                case 'pending-first':
                    filtered.sort((a, b) => a.completed - b.completed);
                    break;
            }

            return filtered;
        }

        function displayHabits() {
            const filteredHabits = getFilteredAndSortedHabits();
            habitsList.innerHTML = '';

            if (habits.length === 0) {
                habitsList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <p>No habits yet! Add your first habit to get started.</p>
                    </div>
                `;
            } else if (filteredHabits.length === 0) {
                habitsList.innerHTML = `
                    <div class="no-results">
                        <div class="no-results-icon">🔍</div>
                        <p>No habits match your current filters.</p>
                    </div>
                `;
            } else {
                filteredHabits.forEach(habit => {
                    const li = document.createElement('li');
                    li.classList.add('habit-item');
                    if (habit.completed) li.classList.add('completed');
                    li.setAttribute("data-id", habit.id);

                    li.innerHTML = `
                        <div class="habit-content">
                            <span style="margin-right: 12px; font-size: 1.2em;">
                                ${habit.completed ? "✅" : "⬜"}
                            </span>
                            <span>${habit.name}</span>
                        </div>
                        <button class="remove-btn" title="Remove habit">🗑️</button>
                    `;
                    habitsList.appendChild(li);
                });
            }

            updateStats();
            updateSummary();
        }

        function updateStats() {
            const total = habits.length;
            const completed = habits.filter(h => h.completed).length;
            const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

            totalHabitsEl.textContent = total;
            completedHabitsEl.textContent = completed;
            completionRateEl.textContent = `${rate}%`;
        }

        function updateSummary() {
            const completed = habits.filter(h => h.completed).length;
            const total = habits.length;
            const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

            summaryText.textContent = `You completed ${completed} out of ${total} habits (${percent}%)`;
            progressBar.style.width = `${percent}%`;

            if (percent === 100 && total > 0) {
                document.querySelector('.container').classList.add('celebrating');
                setTimeout(() => {
                    document.querySelector('.container').classList.remove('celebrating');
                }, 600);
            }

            // Update clear button visibility
            clearCompletedBtn.style.display = completed > 0 ? 'block' : 'none';
        }

        function showRemoveAlert(habitId) {
            pendingRemoveId = habitId;
            removeAlertOverlay.classList.add('show');
        }

        function hideRemoveAlert() {
            removeAlertOverlay.classList.remove('show');
            pendingRemoveId = null;
        }

        function showEmptyAlert() {
            emptyAlertOverlay.classList.add('show');
        }

        function hideEmptyAlert() {
            emptyAlertOverlay.classList.remove('show');
        }

        function showClearAlert() {
            clearAlertOverlay.classList.add('show');
        }

        function hideClearAlert() {
            clearAlertOverlay.classList.remove('show');
        }

        function removeHabit(habitId) {
            const habitElement = document.querySelector(`[data-id="${habitId}"]`);
            if (habitElement) {
                habitElement.classList.add('removing');
                setTimeout(() => {
                    habits = habits.filter(h => h.id !== habitId);
                    displayHabits();
                }, 300);
            }
        }

        function clearCompletedHabits() {
            const completedElements = document.querySelectorAll('.habit-item.completed');
            completedElements.forEach(el => el.classList.add('removing'));
            
            setTimeout(() => {
                habits = habits.filter(h => !h.completed);
                displayHabits();
            }, 300);
        }

        // Event Listeners
        habitsList.addEventListener("click", e => {
            const habitItem = e.target.closest('.habit-item');
            if (!habitItem || !habitItem.dataset.id) return;

            const clickedId = Number(habitItem.dataset.id);

            if (e.target.classList.contains('remove-btn')) {
                e.stopPropagation();
                showRemoveAlert(clickedId);
                return;
            }

            const habit = habits.find(h => h.id === clickedId);
            if (habit) {
                habit.completed = !habit.completed;
                displayHabits();
            }
        });

        addHabitBtn.addEventListener('click', () => {
            if (habitsForm.style.display === 'none' || habitsForm.style.display === '') {
                habitsForm.style.display = 'block';
                addHabitBtn.textContent = '❌ Cancel';
                habitInput.focus();
            } else {
                habitsForm.style.display = 'none';
                addHabitBtn.textContent = '➕ Add New Habit';
                habitInput.value = '';
            }
        });

        clearCompletedBtn.addEventListener('click', () => {
            showClearAlert();
        });

        habitsForm.onsubmit = e => {
            e.preventDefault();
            const name = habitInput.value.trim();
            if (name) {
                const newHabit = {
                    id: Date.now(),
                    name,
                    completed: false,
                    createdAt: Date.now()
                };
                habits.push(newHabit);
                displayHabits();
                habitInput.value = '';
                habitsForm.style.display = 'none';
                addHabitBtn.textContent = '➕ Add New Habit';
            } else {
                showEmptyAlert();
            }
        };

        // Search functionality
        searchInput.addEventListener('input', () => {
            displayHabits();
        });

        // Filter functionality
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                displayHabits();
            });
        });

        // Sort functionality
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            displayHabits();
        });

        // Alert event listeners
        removeAlertCancel.addEventListener('click', hideRemoveAlert);
        removeAlertConfirm.addEventListener('click', () => {
            if (pendingRemoveId) {
                removeHabit(pendingRemoveId);
            }
            hideRemoveAlert();
        });

        emptyAlertOk.addEventListener('click', () => {
            hideEmptyAlert();
            habitInput.focus();
        });

        clearAlertCancel.addEventListener('click', hideClearAlert);
        clearAlertConfirm.addEventListener('click', () => {
            clearCompletedHabits();
            hideClearAlert();
        });

        // Click outside to close alerts
        removeAlertOverlay.addEventListener('click', e => {
            if (e.target === removeAlertOverlay) hideRemoveAlert();
        });
        emptyAlertOverlay.addEventListener('click', e => {
            if (e.target === emptyAlertOverlay) hideEmptyAlert();
        });
        clearAlertOverlay.addEventListener('click', e => {
            if (e.target === clearAlertOverlay) hideClearAlert();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                if (removeAlertOverlay.classList.contains('show')) {
                    hideRemoveAlert();
                } else if (emptyAlertOverlay.classList.contains('show')) {
                    hideEmptyAlert();
                } else if (clearAlertOverlay.classList.contains('show')) {
                    hideClearAlert();
                } else if (habitsForm.style.display === 'block') {
                    habitsForm.style.display = 'none';
                    addHabitBtn.textContent = '➕ Add New Habit';
                    habitInput.value = '';
                }
            } else if (e.key === '/' && !e.target.matches('input')) {
                e.preventDefault();
                searchInput.focus();
            }
        });

        // Initialize the app
        displayHabits();
