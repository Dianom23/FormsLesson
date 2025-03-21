document.addEventListener('DOMContentLoaded', function() {
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    const errorElement = document.getElementById('error');
    const successElement = document.getElementById('success');
    const loadingElement = document.getElementById('loading');
    const totalUsersElement = document.getElementById('totalUsers');
    
    // Загрузка статистики пользователей
    function loadUserStats() {
        fetch('get_users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных');
                }
                return response.json();
            })
            .then(data => {
                loadingElement.style.display = 'none';
                
                if (data.success && data.users) {
                    totalUsersElement.textContent = data.users.length;
                } else {
                    totalUsersElement.textContent = '0';
                }
            })
            .catch(error => {
                loadingElement.style.display = 'none';
                errorElement.textContent = 'Ошибка: ' + error.message;
                errorElement.style.display = 'block';
            });
    }
    
    // Обработчик для кнопки удаления всех пользователей
    if (deleteAllBtn) {
        deleteAllBtn.addEventListener('click', function() {
            const confirmation = confirm('ВНИМАНИЕ! Вы собираетесь удалить ВСЕХ пользователей. Это действие невозможно отменить. Продолжить?');
            
            if (confirmation) {
                // Показываем индикатор загрузки
                loadingElement.textContent = 'Удаление всех пользователей...';
                loadingElement.style.display = 'block';
                successElement.style.display = 'none';
                errorElement.style.display = 'none';
                
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
                    loadingElement.style.display = 'none';
                    
                    if (data.success) {
                        successElement.textContent = `Все пользователи успешно удалены. Количество удаленных записей: ${data.deletedCount}`;
                        successElement.style.display = 'block';
                        
                        // Обновляем статистику
                        loadUserStats();
                    }
                })
                .catch(error => {
                    loadingElement.style.display = 'none';
                    errorElement.textContent = 'Ошибка: ' + error.message;
                    errorElement.style.display = 'block';
                });
            }
        });
    }
    
    // Загружаем статистику при загрузке страницы
    loadUserStats();
}); 