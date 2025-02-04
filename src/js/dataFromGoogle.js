export function dataFromGoogle(googleApiAdress) {
  const load = document.getElementById("load");
  let dataInits = {};

  if (!localStorage.initData) {
      try {
          fetch(googleApiAdress)
              .then((response) => {
                  if (!response.ok) {
                      throw new Error("Ошибка сети");
                  }
                  return response.json();
              })
              .then((data) => {
                  if (data && typeof data === "object") {
                      employee.innerHTML = "";
                      if (data.columnB) {
                          dataInits.employee = data.columnB;
                          data.columnB.forEach((item) => {
                              let newOption = document.createElement("option");
                              newOption.value = item;
                              employee.appendChild(newOption);
                          });
                      }
                      if (data.columnC) {
                          dataInits.cars = data.columnC;
                          data.columnC.forEach((item) => {
                              let newOption = document.createElement("option");
                              newOption.value = item;
                              cars.appendChild(newOption);
                          });
                      }
                      if (data.columnD) {
                          dataInits.units = data.columnD;
                          let unit = document.getElementById("unit");
                          let options = unit.querySelectorAll("option");

                          // Удаляем все опции, начиная с 2-й (индекс 1) и дальше
                          options.forEach((option, index) => {
                              if (index > 0) {
                                  option.remove();
                              }
                          });
                          data.columnD.forEach((item) => {
                              let newOption = document.createElement("option");
                              newOption.value = item;
                              newOption.textContent = item;
                              unit.appendChild(newOption);
                          });
                      }

                      // Добавляем свойство city в объект перед сохранением
                      data.city = googleApiAdress;

                      // Сохраняем обновленные данные в localStorage
                      localStorage.setItem("initData", JSON.stringify(data));

                      // Восстанавливаем данные формы, если они есть
                      const savedData = localStorage.getItem("formData");
                      if (savedData) {
                          const formData = JSON.parse(savedData);
                          document.getElementById("unit").value = formData.unit || "";
                      }

                      // Завершаем загрузку
                      if (load) {
                          setTimeout(() => {
                              load.classList.add("finish");
                              load.addEventListener(
                                  "transitionend",
                                  () => {
                                      load.remove();
                                  },
                                  { once: true }
                              );
                          }, 1000);
                      }
                  }
              })
              .catch((error) => {
                  if (load) {
                      setTimeout(() => {
                          load.classList.add("finish");
                          load.addEventListener(
                              "transitionend",
                              () => {
                                  load.remove();
                              },
                              { once: true }
                          );
                      }, 1000);
                  }
                  console.error("Ошибка:", error);
              });
      } catch {
          console.log("Нет базы данных");
      }
  } else {
      if (load) {
          setTimeout(() => {
              load.classList.add("finish");
              load.addEventListener(
                  "transitionend",
                  () => {
                      load.remove();
                  },
                  { once: true }
              );
          }, 1000);
      }
  }
}
