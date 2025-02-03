export function selectCities() {
    const citiesItems = document.querySelectorAll('.modal__cities-item');
    const selectCityBtn = document.getElementById('selectCityBtn');
    let selectedCity
    function activateButton() {
        selectCityBtn.disabled = false;
        selectCityBtn.classList.add('active');
    }

    // Функция для деактивации кнопки
    function deactivateButton() {
        selectCityBtn.disabled = true;
        selectCityBtn.classList.remove('active');
        selectedCity = ''
    }
    citiesItems.forEach(item => {
        item.addEventListener('click', () => {
            // Убираем класс 'selected' у всех городов
            if (item.classList.contains('selected')) {
                item.classList.remove('selected')
                deactivateButton()
                console.log(selectedCity);
            } else {
                citiesItems.forEach(city => city.classList.remove('selected'));
                selectedCity = item.getAttribute('data-city');
                // Добавляем класс 'selected' для выбранного города

                item.classList.add('selected');
                console.log(selectedCity);

                // Активируем кнопку
                activateButton();

            }
        });
    });

    // Обработчик для клика на кнопку (если нужно, можно добавить логику для перехода)
    selectCityBtn.addEventListener('click', () => {

    });
}