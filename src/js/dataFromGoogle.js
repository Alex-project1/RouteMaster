export function dataFromGoogle(googleApiAdress){
    const load = document.getElementById("load");
    let dataInits=[]
    if(localStorage.initData){
        console.log('данные есть в локалсторейдж');
        console.log(localStorage.getItem("initData"));
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
    }else{
        
        console.log('данных нет в локалсторейдж');
        try {
    
    
            fetch(googleApiAdress)
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Ошибка сети");
                }
                return response.json();
              })
              .then((data) => {
                if (data && typeof data === 'object') {
          
                  // console.log('Данные из столбца B:', data.columnB);
                  // console.log('Данные из столбца C:', data.columnC);
                  console.log("vse dannie", data);
          
                  employee.innerHTML = "";
                  if (data.columnB) {
                    dataInits.employee = data.columnB
                    data.columnB.forEach((item) => {
                      let newOption = document.createElement("option");
                      newOption.value = item;
                      employee.appendChild(newOption);
                    });
                  }
                  if (data.columnC) {
                    dataInits.cars = data.columnC
                    data.columnC.forEach((item) => {
                      let newOption = document.createElement("option");
                      newOption.value = item;
                      cars.appendChild(newOption);
                    });
                  }
                  if (data.columnD) {
                    dataInits.units = data.columnD
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
                  localStorage.setItem("initData", JSON.stringify(data));
                  const savedData = localStorage.getItem("formData");
                  if (savedData) {
                    const data = JSON.parse(savedData);
          
                    document.getElementById("unit").value = data.unit || "";
                  }
                  console.log("loading finish");
          
           
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
            console.log('net bd');
          
          }
          
    }
}