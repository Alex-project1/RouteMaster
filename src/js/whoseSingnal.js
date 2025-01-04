export function whoseSingnal() {
  let signalHolding = 0;
  let signalVenbest = 0;

  document.querySelectorAll(".route__row select").forEach((select) => {
    const selectedOption = select.options[select.selectedIndex];

    // Проверяем, что выбранная опция существует
    if (selectedOption) {
      const dataValuewhose = selectedOption.getAttribute("data-valuewhose");

      if (dataValuewhose) {
        if (dataValuewhose === "signalHolding") {
          signalHolding += 1;
        } else if (dataValuewhose === "signalVenbest") {
          signalVenbest += 1;
        }
      }
    }
  });

  // Возвращаем объект с результатами
  return {
    signalHolding,
    signalVenbest,
  };
}
