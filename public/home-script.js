document.addEventListener('DOMContentLoaded', function() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const usersTable = document.getElementById('usersTable');
    const usersTableBody = document.getElementById('usersTableBody');
    const noUsersElement = document.getElementById('noUsers');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    
    // Загрузка списка пользователей с сервера
    function loadUsers() {
        fetch('get_users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных');
                }
                return response.json();
            })
            .then(data => {
                loadingElement.style.display = 'none';
                
                if (data.success && data.users && data.users.length > 0) {
                    // Отображаем таблицу и заполняем ее данными
                    usersTable.style.display = 'table';
                    noUsersElement.style.display = 'none';
                    
                    // Очищаем таблицу перед заполнением
                    usersTableBody.innerHTML = '';
                    
                    // Заполняем таблицу данными
                    data.users.forEach(user => {
                        const row = document.createElement('tr');
                        
                        // Форматирование даты (если нужно)
                        const date = new Date(user.registrationDate);
                        const formattedDate = date.toLocaleString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                        
                        row.innerHTML = `
                            <td>${user.id}</td>
                            <td>${user.fullName}</td>
                            <td>${user.email}</td>
                            <td>${formattedDate}</td>
                        `;
                        
                        usersTableBody.appendChild(row);
                    });
                } else {
                    // Если нет пользователей, показываем соответствующее сообщение
                    usersTable.style.display = 'none';
                    noUsersElement.style.display = 'block';
                }
            })
            .catch(error => {
                loadingElement.style.display = 'none';
                usersTable.style.display = 'none';
                errorElement.textContent = 'Ошибка: ' + error.message;
                errorElement.style.display = 'block';
            });
    }
    
    // Добавляем обработчик для кнопки удаления всех пользователей
    if (deleteAllBtn) {
        deleteAllBtn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите удалить ВСЕХ пользователей?')) {
                fetch('users', {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка при удалении пользователей');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        // Обновляем список после удаления
                        loadUsers();
                        alert('Все пользователи успешно удалены');
                    }
                })
                .catch(error => {
                    errorElement.textContent = 'Ошибка: ' + error.message;
                    errorElement.style.display = 'block';
                });
            }
        });
    }
    
    // Загружаем список пользователей при загрузке страницы
    loadUsers();
}); 