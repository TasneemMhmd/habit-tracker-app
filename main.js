        let habits = [];

        // Initialize with default habits if none exist
        if (habits.length === 0) {
            habits = [
                { id: 1, name: "Reading", completed: false },
                { id: 2, name: "Exercise", completed: true },
                { id: 3, name: "Meditation", completed: false },
                { id: 4, name: "Drink Water", completed: false }
            ];
        }

        // DOM elements
        const habitsList = document.getElementById('habits-list');
        const addHabitBtn = document.getElementById('add-habit');
        const habitsForm = document.getElementById('habits-form');
        const habitInput = document.getElementById('habit-name');
        const summaryText = document.getElementById('summary-text');
        const progressBar = document.getElementById('progress-bar');

        // Alert elements
        const removeAlertOverlay = document.getElementById('remove-alert-overlay');
        const removeAlertCancel = document.getElementById('remove-alert-cancel');
        const removeAlertConfirm = document.getElementById('remove-alert-confirm');
        const emptyAlertOverlay = document.getElementById('empty-alert-overlay');
        const emptyAlertOk = document.getElementById('empty-alert-ok');

        // Display habits
        function displayHabits() {
            habitsList.innerHTML = '';

            if (habits.length === 0) {
                habitsList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <p>No habits yet! Add your first habit to get started.</p>
                    </div>
                `;
            } else {
                habits.forEach(habit => {
                    const li = document.createElement('li');
                    li.classList.add('habit-item');
                    if (habit.completed) {
                        li.classList.add('completed');
                    }
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

            updateSummary();
        }

        // Update summary and progress
        function updateSummary() {
            const completed = habits.filter(h => h.completed).length;
            const total = habits.length;
            const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

            summaryText.textContent = `You completed ${completed} out of ${total} habits (${percent}%)`;
            progressBar.style.width = `${percent}%`;

            // Celebration effect when 100% complete
            if (percent === 100 && total > 0) {
                document.querySelector('.container').classList.add('celebrating');
                setTimeout(() => {
                    document.querySelector('.container').classList.remove('celebrating');
                }, 600);
            }
        }

        // Alert functionality
        let pendingRemoveId = null;

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

        // Close alerts when clicking outside
        removeAlertOverlay.addEventListener('click', (e) => {
            if (e.target === removeAlertOverlay) {
                hideRemoveAlert();
            }
        });

        emptyAlertOverlay.addEventListener('click', (e) => {
            if (e.target === emptyAlertOverlay) {
                hideEmptyAlert();
            }
        });

        // Remove habit with animation
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

        // Event delegation for habit interactions
        habitsList.addEventListener("click", function (e) {
            const habitItem = e.target.closest('.habit-item');
            if (!habitItem || !habitItem.dataset.id) return;

            const clickedId = Number(habitItem.dataset.id);

            // Check if remove button was clicked
            if (e.target.classList.contains('remove-btn')) {
                e.stopPropagation();
                showRemoveAlert(clickedId);
                return;
            }

            // Toggle habit completion (only if not clicking remove button)
            const habit = habits.find(h => h.id === clickedId);
            if (habit) {
                habit.completed = !habit.completed;
                displayHabits();
            }
        });

        // Toggle form visibility
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

        // Add new habit
        habitsForm.onsubmit = (e) => {
            e.preventDefault();
            const name = habitInput.value.trim();
            if (name) {
                const newHabit = {
                    id: Date.now(),
                    name,
                    completed: false
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

        // Initial display
        displayHabits();

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (removeAlertOverlay.classList.contains('show')) {
                    hideRemoveAlert();
                } else if (emptyAlertOverlay.classList.contains('show')) {
                    hideEmptyAlert();
                } else if (habitsForm.style.display === 'block') {
                    habitsForm.style.display = 'none';
                    addHabitBtn.textContent = '➕ Add New Habit';
                    habitInput.value = '';
                }
            }
        });
