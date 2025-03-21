document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const responseDiv = document.getElementById('response');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        
        // Формируем URL с query параметрами
        const url = `http://localhost:3000/register?fullName=${fullName}&email=${email}`;
        
        // Отправка данных на сервер через GET запрос
        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.json();
        })
        .then(data => {
            responseDiv.textContent = data.message;
            responseDiv.className = 'response success';
        })
        .catch(error => {
            responseDiv.textContent = 'Произошла ошибка: ' + error.message;
            responseDiv.className = 'response error';
        });
    });
}); 