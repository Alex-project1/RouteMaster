export function specificKilometer() {
    // Объявляем переменные
    let signal = 0;
    let point = 0;
    let familiarization = 0;
    let patrol = 0;
    let breaks = 0;
    let pickupH = 0;
    let pickupV = 0;
    let wash = 0;
    let service = 0;
    let check = 0;
    let change = 0;
    let other = 0;

    // Логика для расчета значений
    document.querySelectorAll('.route__row select').forEach(select => {
        // Получаем родительский контейнер маршрута (с data-id)
        const routeContainer = select.closest('.route');

        // Получаем выбранный option
        const selectedOption = select.options[select.selectedIndex];

        // Получаем значение из поля distance
        const distanceInput = routeContainer.querySelector('.distance');
        const distance = parseFloat(distanceInput.value) || 0; // Обрабатываем случай, если значение не введено

        // Проверяем, выбран ли вариант с соответствующим data-value
        const dataValue = selectedOption.getAttribute('data-value');

        if (dataValue) {
            // Если есть переменная с таким же именем, прибавляем расстояние
            if (dataValue === 'signal') {
                signal += distance;
            } else if (dataValue === 'point') {
                point += distance
            } else if (dataValue === 'familiarization') {
                familiarization += distance;
            } else if (dataValue === 'patrol') {
                patrol += distance;
            } else if (dataValue === 'breaks') {
                breaks += distance;
            } else if (dataValue === 'pickupH') {
                pickupH += distance;
            } else if (dataValue === 'pickupV') {
                pickupV += distance;
            } else if (dataValue === 'wash') {
                wash += distance;
            } else if (dataValue === 'service') {
                service += distance;
            } else if (dataValue === 'check') {
                check += distance;
            }
            else if (dataValue === 'change') {
                change += distance;
           }
             else if (dataValue === 'other') {
                other += distance;
            }
        }
    });

    // Возвращаем объект с результатами
    return { signal,point, familiarization, patrol, breaks, pickupH, pickupV, wash, service, check, change, other };


}
