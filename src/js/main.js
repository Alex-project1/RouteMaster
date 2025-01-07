import "../styles/style.scss";
import { specificKilometer } from "./specificKilometer.js";
import { whoseSingnal } from "./whoseSingnal.js";
// localStorage.clear();
const zp = 'https://script.google.com/macros/s/AKfycbxDkeCMID-_54GCl5ohyLhpvZhrTdZC4RQ6PJP47JUnrdIVxblDz-AWCkfQEyGlhURu/exec';
const dn = 'https://script.google.com/macros/s/AKfycbzGnEK-gtVVojssszrzHxHCeO0q6Lu6oXDsk-CCKKlfpqjA6XeSQrZHHeAyclZdYAcSkA/exec'
const googleApiAdress = zp;
const employee = document.getElementById('employee');
const cars = document.getElementById('cars');
const unit = document.getElementById('unit');

let routeCounter = 0;
const routesContainer = document.getElementById('routesContainer')
const forward = document.querySelector(".forward");
const modalContainer = document.querySelector(".modal__save ");
let routeTitles;
const resulBtn = document.getElementById("resulBtn");
const resultsBody = document.getElementById("results");
resulBtn.addEventListener("click", () => {
  resultsBody.classList.toggle("active");
});
// сворачивание маршрута начало ******************
function hide() {
  routeTitles = document.querySelectorAll(".route__title");

  // Убираем все предыдущие обработчики (если они есть)
  routeTitles.forEach((title) => {
    title.removeEventListener("click", toggleRoute);
  });

  // Добавляем новые обработчики
  routeTitles.forEach((title) => {
    title.addEventListener("click", toggleRoute);
  });
}
// сворачивание маршрута начало *****************************
// Боевая или не боевая сработка начало ****************************
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
        const routeDiv =  arrestedDiv.closest(".route")
        routeDiv.classList.remove("signal");
        const isCombatBox  = routeDiv.querySelector('.isCombat__box ')
        const arrestedBox = routeDiv.querySelector('.arrested')
        const inputs = arrestedBox.querySelectorAll("input");
        inputs.forEach((input) => {
          input.value = 0;
        });
        isCombatBox.classList.remove('combat')
        arrestedBox.classList.add('dn')
        routeDiv.classList.remove('combat')
      }
    }
  }
});
// Боевая или не боевая сработка конец ****************************
// Функция-обработчик
function toggleRoute(event) {
  const title = event.currentTarget; // Текущий элемент
  const toggleValue = title.dataset.toggle;
  const itemBody = document.getElementById(toggleValue);
  if (itemBody) {
    itemBody.classList.toggle("active");
    title.classList.toggle("active");
  }
}

function saveToLocalStorage() {
  const data = {
    date: document.getElementById("date").value,
    unit: document.getElementById("unit").value,
    driver: document.getElementById("driver").value,
    senior: document.getElementById("senior").value,
    car: document.getElementById("car").value,
    startOdometer: document.getElementById("startOdometer").value,
    routes: [],
    signalsHolding: document.getElementById("signalsHolding").value,
    signalsVenbest: document.getElementById("signalsVenbest").value,
    extendedOdometr: [], // Добавляем поле extendedOdometr
    signalHolding: 0,
    signalVenbest: 0,
    signalsDop: document.getElementById("signalsDop").value,
    totalTransferred: 0,
    totalDelayed: 0,
  };

  // Получаем данные маршрутов
  document.querySelectorAll("#routesContainer .route").forEach((route) => {
    const inputs = route.querySelectorAll(".input");
    const isCombatBox = route.querySelector(".isCombat__box");
    // console.log(isCombatBox);
    let isCombat = false;
    if (isCombatBox) {
      if (isCombatBox.classList.contains("combat")) {
        isCombat = true;
      }
    }
    // console.log("*********************************");
    // console.log(inputs);
    // console.log("*********************************");

    data.routes.push({
      from: inputs[0].value,
      departureTime: inputs[1].value,
      to: inputs[2].value,
      arrivalTime: inputs[3].value,
      distance: parseFloat(inputs[4].value) || "",
      purpose: inputs[5].value,
      delayed: inputs[6].value || 0,
      transferred: inputs[7].value || 0,
      message: inputs[8].value,
      isCombat: isCombat,
    });
  });

  // Получаем данные километража
  const kilometers = specificKilometer();
  const whoseSingnals = whoseSingnal();
  data.signalHolding = whoseSingnals.signalHolding;
  data.signalVenbest = whoseSingnals.signalVenbest;
  // Добавляем данные в extendedOdometr
  data.extendedOdometr.push({
    signal: kilometers.signal || 0,
    point: kilometers.point || 0,
    familiarization: kilometers.familiarization || 0,
    patrol: kilometers.patrol || 0,
    breaks: kilometers.breaks || 0,
    pickupH: kilometers.pickupH || 0,
    pickupV: kilometers.pickupV || 0,
    wash: kilometers.wash || 0,
    service: kilometers.service || 0,
    check: kilometers.check || 0,
    change: kilometers.change || 0,
    other: kilometers.other || 0,
  });
  let totalTransferred = 0;

  // Перебираем все маршруты
  data.routes.forEach((route) => {
    totalTransferred += parseFloat(route.transferred) || 0; // Добавляем значение, если оно существует, или 0
  });
  let totalDelayed = 0;

  // Перебираем все маршруты
  data.routes.forEach((route) => {
    totalDelayed += parseFloat(route.delayed) || 0; // Добавляем значение, если оно существует, или 0
  });
  data.totalTransferred = totalTransferred;
  data.totalDelayed = totalDelayed;

  document.getElementById("signal").textContent = kilometers.signal;
  document.getElementById("point").textContent = kilometers.point;
  document.getElementById("familiarization").textContent =
    kilometers.familiarization;
  document.getElementById("patrol").textContent = kilometers.patrol;
  document.getElementById("breaks").textContent = kilometers.breaks;
  document.getElementById("pickupH").textContent = kilometers.pickupH;
  document.getElementById("pickupV").textContent = kilometers.pickupV;
  document.getElementById("wash").textContent = kilometers.wash;
  document.getElementById("service").textContent = kilometers.service;
  document.getElementById("check").textContent = kilometers.check;
  document.getElementById("change").textContent = kilometers.change;
  document.getElementById("other").textContent = kilometers.other;

  document.getElementById("totalH").textContent = data.signalHolding;
  document.getElementById("totalV").textContent = data.signalVenbest;

  document.getElementById("signalsHolding").value = data.signalHolding;
  document.getElementById("signalsVenbest").value = data.signalVenbest;

  document.getElementById("totalD").textContent = data.signalsDop;

  document.getElementById("totalArest").textContent = data.totalDelayed;
  document.getElementById("totalTransferred").textContent =
    data.totalTransferred;

  // Сохраняем данные в localStorage
  localStorage.setItem("formData", JSON.stringify(data));
  // console.log("Данные сохранены в localStorage:", data);
  // modalContainer.classList.remove("dn");
  updateTotalSignals();
}
forward.addEventListener("click", () => {
  modalContainer.classList.add("dn");
});
// Функция для загрузки данных из localStorage
function loadFromLocalStorage() {
  // console.log("reload");

  const savedData = localStorage.getItem("formData");
  if (savedData) {
    const data = JSON.parse(savedData);
    console.log(data, "-------");

    document.getElementById("date").value = data.date || "";
    document.getElementById("unit").value = data.unit || "";
    document.getElementById("driver").value = data.driver || "";
    document.getElementById("senior").value = data.senior || "";
    document.getElementById("car").value = data.car || "";
    document.getElementById("startOdometer").value = data.startOdometer || "";
    document.getElementById("signalsVenbest").value = data.signalsVenbest || "";
    document.getElementById("signalsHolding").value = data.signalsHolding || "";
    document.getElementById("signalsHolding").value = data.signalHolding;
    document.getElementById("signalsVenbest").value = data.signalVenbest;
    document.getElementById("signalsDop").value = data.signalsDop;
    document.getElementById("totalD").textContent = data.signalsDop;
    document.getElementById("totalH").textContent = data.signalHolding;
    document.getElementById("totalV").textContent = data.signalVenbest;

    document.getElementById("totalArest").textContent = data.totalDelayed;
    document.getElementById("totalTransferred").textContent =
      data.totalTransferred;

    // document.getElementById("totalV").textContent = data.signalVenbest;

    // console.log("Данные загружены из localStorage:", data);
    // Обновляем значения на странице
    document.getElementById("signal").textContent =
      data.extendedOdometr[0].signal;
    document.getElementById("point").textContent =
      data.extendedOdometr[0].point;
    document.getElementById("familiarization").textContent =
      data.extendedOdometr[0].familiarization;
    document.getElementById("patrol").textContent =
      data.extendedOdometr[0].patrol;
    document.getElementById("breaks").textContent =
      data.extendedOdometr[0].breaks;
    document.getElementById("pickupH").textContent =
      data.extendedOdometr[0].pickupH;
    document.getElementById("pickupV").textContent =
      data.extendedOdometr[0].pickupV;
    document.getElementById("wash").textContent = data.extendedOdometr[0].wash;
    document.getElementById("service").textContent =
      data.extendedOdometr[0].service;
    document.getElementById("check").textContent =
      data.extendedOdometr[0].check;
    document.getElementById("change").textContent =
      data.extendedOdometr[0].change;
    document.getElementById("other").textContent =
      data.extendedOdometr[0].other;

    routeCounter = data.routes.length;

    const container = document.getElementById("routesContainer");
    data.routes.forEach((route, index) => {
      // console.log("route");
      // console.log(route);
      // console.log("route");
      // let isCombat = false;
      const routeDiv = document.createElement("div");
      routeDiv.classList.add("route");
      if (route.purpose === "Спрацювання") {
        routeDiv.classList.add("signal");
      }
      if(route.isCombat){
        routeDiv.classList.add('combat')
      }
      routeDiv.setAttribute("data-id", `box${index + 1}`);

      routeDiv.innerHTML = `
            <div class="route__title" data-toggle="box${index + 1}">
            <h2>Поїздка <span>${index + 1}</span> </h2>
            <div class="route__hide">Згорнути</div>

            </div>
            <div class="route__row-box "  id="box${index + 1}">
            <div>
                <div class="hide__box">

                    <div class="route__row streetRow">
                        <input class="input req suggestions"  type="text" placeholder="Звідки" id="from${index + 1}" required="" value="${route.from
        }">
                        <input class="input req" type="time" required="" value="${route.departureTime
        }">
                    </div>
                    <div class="route__row streetRow">
                        <input class="input req suggestions" type="text" placeholder="Куди" id="to${index + 1}" required="" value="${route.to
        }">
                        <input class="input req" type="time" required="" value="${route.arrivalTime
        }">
                    </div>
                    <div class="route__row last" id="last">
                        <input class="input distance req" type="number"  placeholder="Відстань(км)" required=""
                        value="${route.distance}">

                           <select class="input req" id="target${index + 1
        }" required>
                    <option data-toggle="arest${index + 1}" value="" selected>                    мета поїздки</option>
                    
                    <option data-toggle="arest${index + 1}" data-value="signal" data-valuewhose="signalHolding" value="Спрацювання ОХ">Спрацювання ОХ</option>

                    <option data-toggle="arest${index + 1}" data-value="signal" data-valuewhose="signalVenbest" value="Спрацювання ВБ">Спрацювання ВБ</option>
                    <option data-toggle="arest${index + 1}"  data-value="point" value="Точка відстою">Точка відстою</option>
                    <option data-toggle="arest${index + 1}" data-value="familiarization" value="Ознайомлення">Ознайомлення</option>
                    <option data-toggle="arest${index + 1}" data-value="patrol" value="Патруль">Патруль</option>
                    <option data-toggle="arest${index + 1}" data-value="breaks" value="Туалет/Обід">Туалет/Обід</option>
                    <option data-toggle="arest${index + 1}" data-value="pickupH" value="Підвіз ОХ">Підвіз ОХ</option>
                    <option data-toggle="arest${index + 1}" data-value="pickupV" value="Підвіз ВБ">Підвіз ВБ</option>
                    <option data-toggle="arest${index + 1}" data-value="wash" value="Мийка">Мийка</option>
                    <option data-toggle="arest${index + 1}" data-value="service" value="СТО">СТО</option>                    
                    <option data-toggle="arest${index + 1}" data-value="check" value="Перевірка">Перевірка</option>                    
                    <option data-toggle="arest${index + 1}" data-value="change" value="Перезмінка">Перезмінка</option>                    
                    <option data-toggle="arest${index + 1}" data-value="other" value="Інше">Інше</option>
                  </select>
                  
                      
                        </div>


  <div class="isCombat ${route.purpose.includes("Спрацювання") ? "active" : ""
        }"" id="arest${index + 1}">
  <div class="isCombat__overflow">
    <span>Бойова??</span>
    <div class="isCombat__box ${route.isCombat ? "combat" : ""}"></div>
  </div>
  </div>

                          <div class="arrested ${route.isCombat ? "" : "dn"
        }"  >


<div class="overflow">

                  <div class="arrested__row">
                    <span>Затримано</span>
                    <input class="input req" value="${route.delayed
        }" type="number" id="arest">
                  </div>
                  <div class="arrested__row">
                    <span>передано до полиції</span>
                    <input class="input req" value="${route.transferred
        }" type="number" >
                  </div>
 </div>

                </div>



                        <div class="route__row">
                        <textarea  class="input"  placeholder="Примітки..." id="message" cols="20" rows="5"> ${route.message
        }</textarea>
                    </div>
            
                    <button type="button" class="deleteRoute">Видалити</button>
                </div>

            </div>
        </div>
            `;
      // console.log("route.purpose=", route.purpose);
      const targetSelect = routeDiv.querySelector(`#target${index + 1}`);
      // console.log(targetSelect);

      if (targetSelect) {
        const options = targetSelect.options;
        // console.log(options);

        for (let i = 0; i < options.length; i++) {
          if (options[i].value.trim() === route.purpose.trim()) {
            options[i].selected = true;
            if (route.purpose.includes("Спрацювання")) {
              routeDiv.classList.add("signal");
              console.log('!!!!!!!!!!!!!!!!!!!!!!');

            }
            break;
          }
        }
      }
      container.appendChild(routeDiv);
    });
  }
  hide();
  updateEndOdometer();
  saveinchange();
  // initAutocomplete()

}

// Добавляем обработчик для кнопки сохранения
// document
//   .getElementById("saveBtn")
//   .addEventListener("click", saveToLocalStorage);

// Загружаем данные при загрузке страницы
window.addEventListener("DOMContentLoaded", loadFromLocalStorage);

function updateTotalSignals() {
  const signalsHolding =
    parseFloat(document.getElementById("signalsHolding").value) || 0;
  const signalsVenbest =
    parseFloat(document.getElementById("signalsVenbest").value) || 0;
  const signalsDop =
    parseFloat(document.getElementById("signalsDop").value) || 0;

  let totalSignals = signalsHolding + signalsVenbest + signalsDop;
  document.getElementById("totalSignals").textContent = totalSignals;
}
function updateEndOdometer() {
  const startOdometer =
    parseFloat(document.getElementById("startOdometer").value) || 0;

  let totalDistance = 0;
  let dailyMileageDate = 0;

  // Суммируем расстояния из маршрутов
  document
    .querySelectorAll("#routesContainer .route input.distance")
    .forEach((input) => {
      totalDistance += parseFloat(input.value) || 0;
    });
  document.getElementById("dailyMileage").textContent = totalDistance;

  // Рассчитываем и обновляем конечное значение спидометра
  const endOdometer = startOdometer + totalDistance;

  document.getElementById("endOdometerValue").textContent =
    endOdometer.toFixed(2);
  document
    .getElementById("signalsHolding")
    .addEventListener("input", updateTotalSignals);
  document
    .getElementById("signalsVenbest")
    .addEventListener("input", updateTotalSignals);
  updateTotalSignals();
}

// Обработчики для обновления спидометра при изменении данных
function addEventListeners() {
  document
    .getElementById("startOdometer")
    .addEventListener("input", updateEndOdometer);

  document
    .getElementById("routesContainer")
    .addEventListener("input", (event) => {
      if (event.target.classList.contains("distance")) {
        updateEndOdometer();
      }
    });

  document.getElementById("addRoute").addEventListener("click", () => {
    console.log('ds');

    routeCounter++;
    const container = document.getElementById("routesContainer");
    const routeDiv = document.createElement("div");
    routeDiv.classList.add("route");

    routeDiv.setAttribute("data-id", `box${routeCounter}`);

    routeDiv.innerHTML = `
        <div class="route__title" data-toggle="box${routeCounter}">
        <h2>Поїздка <span>${routeCounter}</span> </h2>
        <div class="route__hide">ЗГОРНУТИ</div>

        </div>
        <div class="route__row-box active" id="box${routeCounter}">
        <div>
            <div class="hide__box">

                <div class="route__row streetRow">
                    <input class="input req suggestions" type="text" placeholder="Звідки" id="from${routeCounter}" required="" value="">
                    <input class="input req" type="time" required="" value="">
                </div>
                <div class="route__row streetRow">
                    <input class="input req suggestions" type="text" placeholder="куди" id="to${routeCounter}"  required="" value="">
                    <input class="input req" type="time" required="" value="">
                </div>
                <div class="route__row last" id="last">
                    <input class="input distance req" type="number" placeholder="Відстань(км)" required=""
                    value="">
              
                            <select class="input req" id="target" required>
                    <option data-toggle="arest${routeCounter}" value="" selected>Мета поїздки</option>
                    <option data-toggle="arest${routeCounter}" data-value="signal" value="Спрацювання ОХ" data-valuewhose="signalHolding">Спрацювання ОХ</option>
                    <option data-toggle="arest${routeCounter}" data-value="signal" value="Спрацювання ВБ" data-valuewhose="signalVenbest">Спрацювання ВБ</option>
                    <option data-toggle="arest${routeCounter}" data-value="point" value="Точка відстою">Точка відстою</option>
                    <option data-toggle="arest${routeCounter}" data-value="familiarization" value="Ознайомлення">Ознайомлення</option>
                    <option data-toggle="arest${routeCounter}" data-value="patrol" value="Патруль">Патруль</option>
                    <option data-toggle="arest${routeCounter}" data-value="breaks" value="Туалет/Обід">Туалет/Обід</option>
                    <option data-toggle="arest${routeCounter}" data-value="pickupH" value="Підвіз ОХ">Підвіз ОХ</option>
                    <option data-toggle="arest${routeCounter}" data-value="pickupV" value="Підвіз ВБ">Підвіз ВБ</option>
                    <option data-toggle="arest${routeCounter}" data-value="wash" value="Мийка">Мийка</option>
                    <option data-toggle="arest${routeCounter}" data-value="service" value="СТО">СТО</option>
                    <option data-toggle="arest${routeCounter}" data-value="check" value="Перевірка">Перевірка</option>
                    
                    <option data-toggle="arest${routeCounter}" data-value="change" value="Перезмінка">Перезмінка</option>
                    
                    
                    
                    
                    <option data-toggle="arest${routeCounter}" data-value="other" value="Інше">Інше</option>
                  </select>
              
                </div>

                  <div class="isCombat" id="arest${routeCounter}">
                    <div class="isCombat__overflow">
                      <span>Бойова?</span>
                      <div class="isCombat__box"></div>
                    </div>
                  </div>

                 <div class="arrested dn" >
  <div class="overflow">
                  <div class="arrested__row">
                    <span>Затримано</span>
                    <input class="input req"  placeholder="Затримано" value="0" type="number" id="arest">
                  </div>
                  <div class="arrested__row">
                    <span>передано до полиції</span>
                    <input class="input req"  value="0" type="number" id="police">
                  </div>
    </div>

                </div>
                <div class="route__row">
                                    <textarea class="input"  placeholder="Примітки..." id="message" cols="20" rows="5"></textarea>
                                </div>
                                <button type="button" class="deleteRoute">Видалити</button>
            </div>

        </div>
    </div>
        `;


    container.appendChild(routeDiv);
    if (routeCounter > 1) {
      let toInput = document.getElementById(`to${routeCounter - 1}`).value;
      let fromInput = document.getElementById(`from${routeCounter}`)
      fromInput.value = `${toInput}`;

      // console.log(routeCounter);

      // console.log(fromInput);
      // console.log(toInput);

    }
    // Обновляем значение конечного спидометра при добавлении маршрута
    updateEndOdometer();
    hide();
    saveinchange();
    // initAutocomplete()
  });


}

// Обработка формы
async function handleFormSubmit(event) {

  // event.preventDefault();





  const modalSendForm = document.createElement("div");
  modalSendForm.className = "modal__sendForm";

  const logo = document.createElement("div");
  logo.className = "logo";

  const logoImg = document.createElement("img");
  logoImg.src = "/public/logo.svg";
  logoImg.alt = "";
  logo.appendChild(logoImg);

  const modalMessage = document.createElement("div");
  modalMessage.className = "modal__message";

  const box = document.createElement("div");
  box.className = "box";

  const createLoading = (textArray) => {
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "loading loading07";
    textArray.forEach((char) => {
      const span = document.createElement("span");
      span.setAttribute("data-text", char);
      span.textContent = char;
      loadingDiv.appendChild(span);
    });
    return loadingDiv;
  };

  // Создаем анимацию "ОТПРАВЛЯЮ"
  const loadingSend = createLoading([
    "В",
    "І",
    "Д",
    "П",
    "Р",
    "А",
    "В",
    "Л",
    "Я",
    "Ю",
  ]);

  // Создаем анимацию "ДАННЫЕ!"
  const loadingData = createLoading(["Д", "А", "Н", "І"]);

  // Добавляем анимации в box
  box.appendChild(loadingSend);
  box.appendChild(loadingData);

  modalMessage.appendChild(box);

  const lastBtn = document.createElement("div");
  lastBtn.className = "lastBtn";
  lastBtn.textContent = "Оновити";

  // Собираем финальную структуру
  modalSendForm.appendChild(logo);
  modalSendForm.appendChild(modalMessage);
  modalSendForm.appendChild(lastBtn);

  // Вставляем в документ
  document.body.appendChild(modalSendForm);
  let signalsCombat = 0;
  let signalsHolding = Number(document.getElementById("signalsHolding").value);
  let signalsVenbest = Number(document.getElementById("signalsVenbest").value);
  let signalsDop = Number(document.getElementById("signalsDop").value);
  let totalSignal = signalsHolding + signalsVenbest + signalsDop;
  const data = {
    date: document.getElementById("date").value,
    unit: document.getElementById("unit").value,
    driver: document.getElementById("driver").value,
    senior: document.getElementById("senior").value,
    signalsHolding: signalsHolding,
    signalsVenbest: signalsVenbest,
    signalsDop: signalsDop,
    signalsCombat: signalsCombat,

    totalSignal: totalSignal,
    car: document.getElementById("car").value,
    totalArest:
      parseFloat(document.getElementById("totalArest").textContent) || 0,
    totalTransferred:
      parseFloat(document.getElementById("totalTransferred").textContent) || 0,
    // odometr ***********************************
    startOdometer:
      Math.round(parseFloat(document.getElementById("startOdometer").value) || 0),
    routes: [],
    endOdometer:
      Math.round(parseFloat(document.getElementById("endOdometerValue").textContent) || 0),
    signalOdometer:
      Math.round(parseFloat(document.getElementById("signal").textContent) || 0),
    pointOdometer:
      Math.round(parseFloat(document.getElementById("point").textContent) || 0),
    familiarizationOdometer:
      Math.round(parseFloat(document.getElementById("familiarization").textContent) || 0),
    patrolOdometer:
      Math.round(parseFloat(document.getElementById("patrol").textContent) || 0),
    breaksOdometer:
      Math.round(parseFloat(document.getElementById("breaks").textContent) || 0),
    pickupHOdometer:
      Math.round(parseFloat(document.getElementById("pickupH").textContent) || 0),
    pickupVOdometer:
      Math.round(parseFloat(document.getElementById("pickupV").textContent) || 0),
    washOdometer:
      Math.round(parseFloat(document.getElementById("wash").textContent) || 0),
    serviceOdometer:
      Math.round(parseFloat(document.getElementById("service").textContent) || 0),
    checkOdometer:
      Math.round(parseFloat(document.getElementById("check").textContent) || 0),
    changeOdometer:
      Math.round(parseFloat(document.getElementById("change").textContent) || 0),
    otherOdometer:
      Math.round(parseFloat(document.getElementById("other").textContent) || 0),
  };

  document.querySelectorAll("#routesContainer .route").forEach((route) => {
    const inputs = route.querySelectorAll(".input");
    const isCombatBox = route.querySelector(".isCombat__box");
    // console.log(isCombatBox);
    let isCombat = 'нет';
    if (isCombatBox) {
      if (isCombatBox.classList.contains("combat")) {
        isCombat = 'да';
        signalsCombat++
      }
    }
    data.routes.push({
      from: inputs[0].value || "",
      departureTime: inputs[1].value || "",
      to: inputs[2].value || "",
      arrivalTime: inputs[3].value || "",
      distance: parseFloat(inputs[4].value) || 0 || "",
      purpose: inputs[5].value || "",
      arest: inputs[6].value || "",
      transferred: inputs[7].value || "",
      message: inputs[8].value || "",
      isCombat: isCombat,
    });
  });
  data.signalsCombat = signalsCombat;

  try {
    // console.log("---------------------------");
    // console.log(data);
    // console.log("---------------------------");

    const response = await fetch(
      googleApiAdress,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        mode: "no-cors", // Запрос с режимом no-cors
      }
    );

    const result = await response.json();
    if (result.status === "success") {
      alert("Данные успешно сохранены в Google Таблицу!");
    } else {
      alert(`Ошибка1: ${result.message}`);
    }
  } catch (error) {
    const box = document.querySelector(".box");
    const lastBtn = document.querySelector(".lastBtn");

    box.classList.add("finish");
    setTimeout(() => {
      box.innerHTML = `<p>Дякую, дані успішно відправлені!</p> `;
      box.classList.remove("finish");
      lastBtn.classList.add("active");
      lastBtn.addEventListener("click", reload);
    }, 300);
  }
}

// Инициализация обработчиков
function init() {
  addEventListeners();
  // document
  //   .getElementById("logForm")
  //   .addEventListener("submit", handleFormSubmit);
}

function reload() {
  localStorage.clear();
  location.reload();
}

// Запуск
init();

document.addEventListener("DOMContentLoaded", () => {
  const load = document.getElementById("load");
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
    }, 3000);
  }
});

// Слушаем изменения на всех инпутах и селектах
function saveinchange() {
  // console.log("save");

  document.querySelectorAll("input, select").forEach((element) => {
    element.addEventListener("input", saveToLocalStorage); // Для инпутов
    element.addEventListener("change", saveToLocalStorage); // Для селектов
  });
}

document.addEventListener("click", (event) => {
  let isCombat = event.target
  // Проверяем, что клик был по элементу с классом isCombat
  if (isCombat.classList.contains("isCombat__box")) {
    // Удаляем класс combat у всех элементов, если нужно

    // Добавляем класс combat только текущему элементу
    isCombat.classList.toggle("combat");
    const routeDiv = isCombat.closest('.route')
    const arestedBox = routeDiv.querySelector('.arrested')
    const arestedInputs = arestedBox.querySelectorAll('input')
    
    let isCombatBox = isCombat.closest(".isCombat");
    let arrested = isCombatBox?.nextElementSibling;
    routeDiv.classList.toggle('combat')
    arestedInputs.forEach(input=>{
      input.value = 0
    })
    if (arrested && arrested.classList.contains("arrested")) {
      arrested.classList.toggle('dn')
    } else {
      // console.log("Блок arrested не найден.");
    }


    saveToLocalStorage();
  }
});
document
  .getElementById("routesContainer")
  .addEventListener("click", (event) => {
    if (event.target.classList.contains("deleteRoute")) {
      const modalDelete = document.querySelector('.modal__delete');
      let routeBox = event.target.closest(".route");

      // console.log(routeBox);
      modalDelete.classList.remove('dn');

      // Получаем кнопки
      const buttonCancel = document.querySelector('.buttonCancel');
      const buttonDelete = document.querySelector('.buttonDelete');

      // Удаляем предыдущие обработчики событий (если они есть)
      buttonCancel.replaceWith(buttonCancel.cloneNode(true));
      buttonDelete.replaceWith(buttonDelete.cloneNode(true));

      // Заново получаем новые элементы после замены
      const newButtonCancel = document.querySelector('.buttonCancel');
      const newButtonDelete = document.querySelector('.buttonDelete');

      // Добавляем обработчики для новых кнопок
      newButtonCancel.addEventListener('click', () => {
        modalDelete.classList.add('dn');
      });

      newButtonDelete.addEventListener('click', () => {
        routeCounter--;
        routeBox.remove();
        modalDelete.classList.add('dn');
        // Обновляем значение конечного спидометра после удаления маршрута
        updateEndOdometer();
        saveToLocalStorage();
      });
    }
  });

saveinchange();






function initAutocomplete(input) {
  // Опции для автозаполнения
  const options = {
    componentRestrictions: { country: "UA" },
    fields: ["address_components", "geometry"],
    types: ["address"],
  };

  // Создаем объект автозаполнения для текущего input
  const autocomplete = new google.maps.places.Autocomplete(input, options);

  // Добавляем обработчик события на изменение места (когда пользователь выбрал предложение из автозаполнения)
  autocomplete.addListener("place_changed", function () {
    const place = autocomplete.getPlace();

    // Если геометрия (координаты) места присутствуют, продолжаем обработку
    if (place.geometry) {
      let streetName = "";
      let cityName = "";
      let houseNumber = "";  // Переменная для хранения номера дома

      // Проходим по компонентам адреса, чтобы найти название улицы, города и номер дома
      place.address_components.forEach((component) => {
        if (component.types.includes("route")) {
          streetName = component.long_name;
        }
        if (component.types.includes("locality")) {
          cityName = component.long_name;
        }
        if (component.types.includes("street_number")) {
          houseNumber = component.long_name;
        }
      });

      // Если улица найдена, комбинируем полный адрес
      if (streetName) {
        let fullAddress = streetName;

        if (houseNumber) {
          fullAddress += `, ${houseNumber}`;
        }

        // console.log("Полный адрес:", fullAddress);
        input.value = fullAddress;  // Записываем полный адрес в инпут
        saveToLocalStorage();  // Сохраняем в localStorage
      }
    }
  });
}

routesContainer.addEventListener('click', (e) => {
  // Инициализируем автозаполнение для каждого инпута с классом "suggestions"
  if (e.target.classList.contains('suggestions')) {
    initAutocomplete(e.target);
  }
});

// Инициализация автозаполнения для всех инпутов с классом "suggestions" при загрузке страницы
// document.querySelectorAll('.suggestions').forEach(input => {
//   initAutocomplete(input);
// });
const buttonSendCancel = document.getElementById('buttonSend-Cancel')
const buttonSendSend = document.getElementById('buttonSend-Send')
const modalSend = document.getElementById('modalSend')
const submit = document.querySelector('.btn--send');

submit.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('sdsd');
  
  let er = [];
  let req = document.querySelectorAll('.req');
  let allBox = document.querySelectorAll('.route');
  
  // Скрытие всех родительских элементов до проверки
  if (allBox) {
    allBox.forEach((box) => {
      let boxTitle = box.querySelector('.route__title');
      let boxBody = box.querySelector('.route__row-box');
      boxTitle.classList.remove('active');
      boxBody.classList.remove('active');
    });
  }

  // Проверка всех обязательных полей
  for (let input of req) {
    input.classList.remove('errore');
    if (input.value.trim() === '') {
      input.classList.add('errore');
      let box = input.closest('.route');
      
      if (box) {
        let boxTitle = box.querySelector('.route__title');
        let boxBody = box.querySelector('.route__row-box');
        boxTitle.classList.add('active');
        boxBody.classList.add('active');
      }

      // Прокрутка к первому пустому полю
      const rect = input.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + rect.top - 75, // Прокрутка на 75 пикселей выше
        behavior: 'smooth'                   // Плавная прокрутка
      });

      er.push(input);
      break; // Прерываем цикл, если нашли первое пустое поле
    }
  }

  console.log(er);

  if (er.length == 0) {
    modalSend.classList.remove('dn');
  }
});

buttonSendSend.addEventListener('click', (e) => {

  handleFormSubmit()
})
buttonSendCancel.addEventListener('click', () => {
  modalSend.classList.add('dn')
})




fetch(googleApiAdress)
  .then(response => {
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }
    return response.json();
  })
  .then(data => {
    // console.log('Данные из столбца B:', data.columnB);
    // console.log('Данные из столбца C:', data.columnC);
    console.log(data);

    employee.innerHTML = '';
    if (data.columnB) {
      data.columnB.forEach(item => {
        let newOption = document.createElement('option');
        newOption.value = item;
        employee.appendChild(newOption)
      })
    }
    if (data.columnC) {
      data.columnC.forEach(item => {
        let newOption = document.createElement('option');
        newOption.value = item;
        cars.appendChild(newOption)
      })
    }
    if (data.columnD) {
      data.columnD.forEach(item => {
        let newOption = document.createElement('option');
        newOption.value = item;
        newOption.textContent = item;
        unit.appendChild(newOption)
      })
    }
  })
  .catch(error => {
    console.error('Ошибка:', error);
  });