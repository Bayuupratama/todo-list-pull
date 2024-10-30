// todo.js

export class TodoApp {
    constructor() {
        this.todoForm = document.getElementById("todo-form");
        this.newTaskInput = document.getElementById("new-task");
        this.todoList = document.getElementById("todo-list");
        this.filterButtons = document.querySelectorAll('.filter-btn');

        // Event listeners
        this.todoForm.addEventListener("submit", (e) => this.handleSubmit(e));
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => this.handleFilter(button));
        });

        // Render tugas saat halaman dimuat
        window.addEventListener("load", () => this.renderTodos());
    }

    // Fungsi untuk mengambil data dari localStorage
    getTodosFromLocalStorage() {
        return JSON.parse(localStorage.getItem("todos")) || [];
    }

    // Fungsi untuk menyimpan data ke localStorage
    saveTodosToLocalStorage(todos) {
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    // Fungsi untuk membuat elemen tugas
    createTodoItem(task, index) {
        const li = document.createElement("li");
        li.classList.add("todo-item");
        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <div>
                <input type="checkbox" ${task.completed ? "checked" : ""} />
                <span>${task.text}</span>
            </div>
            <button class="remove-btn">Remove</button>
        `;

        // Event listener untuk checkbox
        li.querySelector('input[type="checkbox"]').addEventListener("change", () => {
            this.toggleCompleteTask(index);
        });

        // Event listener untuk tombol "Remove"
        li.querySelector(".remove-btn").addEventListener("click", () => {
            this.confirmDeleteTask(index);
        });

        return li;
    }

    // Fungsi untuk memperbarui tampilan daftar tugas berdasarkan filter
    renderTodos(filter = 'all') {
        this.todoList.innerHTML = ""; // Kosongkan daftar
        const todos = this.getTodosFromLocalStorage(); // Ambil data dari localStorage
        
        todos.forEach((task, index) => {
            if (filter === 'all' || (filter === 'completed' && task.completed) || (filter === 'active' && !task.completed)) {
                this.todoList.appendChild(this.createTodoItem(task, index));
            }
        });
    }

    // Fungsi untuk menambahkan tugas baru
    addTask(taskText) {
        const todos = this.getTodosFromLocalStorage();
        todos.push({ text: taskText, completed: false });
        this.saveTodosToLocalStorage(todos);
        this.renderTodos();

        // SweetAlert notifikasi setelah tugas berhasil ditambahkan
        Swal.fire({
            title: 'Task Added!',
            text: `Your task "${taskText}" has been successfully added to the list.`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    // Fungsi untuk menandai tugas sebagai selesai atau belum selesai
    toggleCompleteTask(index) {
        const todos = this.getTodosFromLocalStorage();
        todos[index].completed = !todos[index].completed;
        this.saveTodosToLocalStorage(todos);
        this.renderTodos(); // Refresh daftar tugas setelah status berubah
    }

    // Fungsi untuk menghapus tugas dengan konfirmasi
    confirmDeleteTask(index) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.removeTask(index);
                Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
            }
        });
    }

    // Fungsi untuk menghapus tugas
    removeTask(index) {
        const todos = this.getTodosFromLocalStorage();
        todos.splice(index, 1);
        this.saveTodosToLocalStorage(todos);
        this.renderTodos();
    }

    // Event handler untuk form submit
    handleSubmit(e) {
        e.preventDefault();
        const taskText = this.newTaskInput.value.trim();
        if (taskText) {
            this.addTask(taskText);
            this.newTaskInput.value = ""; // Kosongkan input setelah menambahkan
        }
    }

    // Event handler untuk tombol filter
    handleFilter(button) {
        const filter = button.getAttribute('data-filter');
        this.renderTodos(filter);

        // Tambahkan class active pada tombol yang dipilih
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }
}

// Inisialisasi aplikasi todo saat halaman dimuat
new TodoApp();
