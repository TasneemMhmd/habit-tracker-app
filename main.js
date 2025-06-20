const habitsList = document.getElementById('habits-list');
habitsList.addEventListener("click", function (e) {
    if (e.target.classList.contains("habit-item")) {
        const clickedId = Number(e.target.dataset.id);
        const habit = habits.find(h => h.id === clickedId);
        if (habit) {
            habit.completed = !habit.completed;

            displayHabits();
        }
    }
});
let habits = JSON.parse(localStorage.getItem('habits'))
if (!habits) {

    habits = [
        { id: 1, name: "Reading", completed: false },
        { id: 2, name: "Eating", completed: true },
        { id: 3, name: "Drinking", completed: false }
    ];
}

function displayHabits() {
    habitsList.innerHTML = ''
    habits.forEach(habit => {
        const li = document.createElement('li');
        li.classList.add('habit-item');
        li.setAttribute("data-id", habit.id);
        li.textContent = `${habit.completed ? "✅" : "⬜"} ${habit.name}`;
        habitsList.appendChild(li);
    })

    const completed = habits.filter(habit => habit.completed).length;
    const total = habits.length;
    const percent = Math.round((completed / total) * 100);
    document.getElementById('summary-text').textContent = `You completed ${completed} out of ${total} habits ✅ (${percent}%)`;
    document.getElementById('progress-bar').style.width = `${percent}%`;
    if (percent === 100) {
        document.getElementById('progress-bar').style.backgroundColor = '#2a9417';
    }else{
        document.getElementById('progress-bar').style.backgroundColor = '#DA7422';
    }
    localStorage.setItem('habits', JSON.stringify(habits));
}
displayHabits();