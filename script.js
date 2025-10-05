document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const emptyMessage = document.getElementById('emptyMessage');

    // Cek tugas dari Local Storage saat aplikasi dimuat
    loadTasks();
    updateEmptyMessage();

    // Event listener untuk tombol 'Tambah'
    addTaskBtn.addEventListener('click', addTask);

    // Event listener untuk tombol 'Enter' pada input
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Event delegation untuk menandai selesai atau menghapus
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('task-text')) {
            toggleComplete(e.target.parentElement);
        } else if (e.target.closest('.delete-btn')) {
            deleteTask(e.target.closest('li'));
        }
    });

    // Fungsi untuk menambahkan tugas
    function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText !== "") {
            const task = {
                text: taskText,
                completed: false
            };
            createTaskElement(task);
            saveTask(task);
            taskInput.value = ''; // Kosongkan input
            updateEmptyMessage();
        } else {
            alert("Tugas tidak boleh kosong!");
        }
    }

    // Fungsi untuk membuat elemen LI (HTML) untuk tugas baru
    function createTaskElement(task) {
        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed');
        }

        const taskSpan = document.createElement('span');
        taskSpan.classList.add('task-text');
        taskSpan.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Ikon tong sampah

        li.appendChild(taskSpan);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }

    // Fungsi untuk mengubah status tugas (selesai/belum selesai)
    function toggleComplete(liElement) {
        liElement.classList.toggle('completed');
        updateLocalStorage();
    }

    // Fungsi untuk menghapus tugas
    function deleteTask(liElement) {
        liElement.remove();
        updateLocalStorage();
        updateEmptyMessage();
    }

    // Fungsi untuk menampilkan/menyembunyikan pesan kosong
    function updateEmptyMessage() {
        emptyMessage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    }

    // --- Persistensi Data (Local Storage) ---

    // Mengambil data tugas dari Local Storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(task => createTaskElement(task));
    }

    // Menyimpan tugas baru ke Local Storage
    function saveTask(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Memperbarui Local Storage setiap kali ada perubahan
    function updateLocalStorage() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
