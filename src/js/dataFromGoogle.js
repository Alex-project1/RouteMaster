export async function dataFromGoogle(googleApiAdress) {
    const dataLoad = document.getElementById("dataLoad");
    let dataInits = {};
  
    if (!localStorage.initData || !localStorage.initData.city) {
      if (dataLoad){
        dataLoad.innerHTML = "";
          dataLoad.textContent = "Формую дані";
      }
  
      try {
        if (dataLoad){
            dataLoad.innerHTML = "";
            dataLoad.textContent = "Формую запит";

        }
        
  
        const response = await fetch(googleApiAdress);
        if (!response.ok) throw new Error("Ошибка сети");
  
        const data = await response.json();
        if (!data || typeof data !== "object") return;
  
        employee.innerHTML = "";
  
        await updateSection("Формую перелік співробітників", () => {
          if (data.columnB) {
            dataInits.employee = data.columnB;
            data.columnB.forEach((item) => {
              let newOption = document.createElement("option");
              newOption.value = item;
              employee.appendChild(newOption);
            });
          }
        });
  
        await updateSection("Формую перелік автівок", () => {
          if (data.columnC) {
            dataInits.cars = data.columnC;
            data.columnC.forEach((item) => {
              let newOption = document.createElement("option");
              newOption.value = item;
              cars.appendChild(newOption);
            });
          }
        });
  
        await updateSection("Формую перелік нарядів", () => {
          if (data.columnD) {
            dataInits.units = data.columnD;
            let unit = document.getElementById("unit");
            let options = unit.querySelectorAll("option");
  
            options.forEach((option, index) => {
              if (index > 0) option.remove();
            });
  
            data.columnD.forEach((item) => {
              let newOption = document.createElement("option");
              newOption.value = item;
              newOption.textContent = item;
              unit.appendChild(newOption);
            });
          }
        });
  
        data.city = googleApiAdress;
        localStorage.setItem("initData", JSON.stringify(data));
  
        if (localStorage.getItem("formData")) {
          const formData = JSON.parse(localStorage.getItem("formData"));
          document.getElementById("unit").value = formData.unit || "";
        }
  
        finishLoading();
      } catch (error) {
        finishLoading();
        console.error("Ошибка:", error);
      }
    } else {
      finishLoading();
    }
  }
  
  async function updateSection(text, callback) {
    const dataLoad = document.getElementById("dataLoad");
    if (dataLoad) {
        dataLoad.textContent = ""; // Очищаем старый текст
        dataLoad.classList.add('hide')

        await new Promise((resolve) => setTimeout(resolve, 150)); // Небольшая задержка
        dataLoad.textContent = text;
        dataLoad.classList.remove('hide')
    }
    await new Promise((resolve) => setTimeout(resolve, 500)); // Минимальное время отображения
    callback();
}

  
  function finishLoading() {
    const load = document.getElementById("load");
    if (load) {
      setTimeout(() => {
        load.classList.add("finish");
        // load.addEventListener("transitionend", () => load.remove(), { once: true });
      }, 1000);
    }
  }
  