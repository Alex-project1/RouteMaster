export function isSignal (){
    document.addEventListener("change", (event) => {
        // Проверяем, является ли изменённый элемент селектом
        if (event.target.matches("select")) {
          const select = event.target;
          const selectedOption = select.options[select.selectedIndex]; // Получаем выбранный оптион
          const toggleId = selectedOption.dataset.toggle; // Получаем значение data-toggle
          // Если у выбранной опции есть атрибут data-toggle
          if (toggleId) {
            const arrestedDiv = document.getElementById(toggleId);
      
            // Проверяем значение data-value
            if (arrestedDiv && selectedOption.dataset.value === "signal") {
              arrestedDiv.classList.add("active");
              arrestedDiv.closest(".route").classList.add("signal");
              // console.log("daaaaaaa");
            } else if (arrestedDiv && selectedOption.dataset.value !== "signal") {
              // console.log("neeeee");
              arrestedDiv.classList.remove("active");
              const routeDiv = arrestedDiv.closest(".route");
              routeDiv.classList.remove("signal");
              const isCombatBox = routeDiv.querySelector(".isCombat__box ");
              const arrestedBox = routeDiv.querySelector(".arrested");
              const inputs = arrestedBox.querySelectorAll("input");
              inputs.forEach((input) => {
                input.value = 0;
              });
              isCombatBox.classList.remove("combat");
              arrestedBox.classList.add("dn");
              routeDiv.classList.remove("combat");
            }
          }
        }
      });
}