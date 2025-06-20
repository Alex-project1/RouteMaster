import "../styles/style.scss";
import { specificKilometer } from "./specificKilometer.js";
import { whoseSingnal } from "./whoseSingnal.js";
import { dataFromGoogle } from "./dataFromGoogle.js";
import { isSignal } from "./isSignal.js";
// localStorage.clear();
// console.log('localStorage',localStorage);
//**************************** */
// Функция для получения адресов через Nominatim API
let allStreetNames = "";

console.log(localStorage);

// console.log('localStorage.getItem("initData")',localStorage.getItem("initData"));

async function getAddresses(query) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=UA`
  );
  const data = await response.json();
  console.log(data);

  return data.map((street) => ({ display_name: street.display_name }));
}

// Функция для отображения подсказок
function showSuggestions(inputElement, suggestions) {
  const suggestionList = document.createElement("ul");
  suggestions.forEach((suggestion) => {
    const suggestionItem = document.createElement("li");
    suggestionItem.textContent = suggestion.display_name;
    suggestionItem.addEventListener("click", () => {
      inputElement.value = suggestion.display_name; // Заполняем инпут выбранным адресом
      suggestionList.remove(); // Убираем список после выбора
    });
    suggestionList.appendChild(suggestionItem);
  });

  // Очищаем старые подсказки
  const existingList = inputElement.parentElement.querySelector("ul");
  if (existingList) {
    existingList.remove();
  }

  inputElement.parentElement.appendChild(suggestionList);
}

//**************************** */
function formDataLocal() {
  if (localStorage.getItem("formData")) {
    let formData = JSON.parse(localStorage.getItem("formData"));
    // console.log('formData');
    // console.log(formData);
    // console.log('formData');
  }
}
formDataLocal();
const hardReload = document.querySelector(".hardReload");
const moadHarReload = document.querySelector(".moadHarReload");
const hardResetCansel = document.getElementById("hardResetCansel");
const hardResetReset = document.getElementById("hardResetReset");
hardReload.addEventListener("click", () => {
  // console.log('sdsdf');
  // reload()
  moadHarReload.classList.remove("dn");
});
hardResetCansel.addEventListener("click", () => {
  if (!moadHarReload.classList.contains("dn"))
    moadHarReload.classList.add("dn");
});
hardResetReset.addEventListener("click", () => {
  reload();
});

const load = document.getElementById("load");
if (load) {
  setTimeout(() => {
    load.classList.add("finish");

    // load.addEventListener(
    //   "transitionend",
    //   () => {
    //     load.remove();
    //   },
    //   { once: true }
    // );
  }, 1000);
}

const zp =
  "https://script.google.com/macros/s/AKfycbw-eakkUUrATU_CEeW8kys38dbJRGPlcWwbgr-1dAmYZwPXoQpsL0QZ7NHhCmA4Strh/exec";
const kv =
  "https://script.google.com/macros/s/AKfycbxo_Xda913XCVNeNvIt74IC3bemZzLIZLnLpLbPJeKQKF3_dYf6ZMDa1Z9UyKystcx2kg/exec";

const dp =
  "https://script.google.com/macros/s/AKfycbzGnEK-gtVVojssszrzHxHCeO0q6Lu6oXDsk-CCKKlfpqjA6XeSQrZHHeAyclZdYAcSkA/exec";
const kr =
  "https://script.google.com/macros/s/AKfycby27hfmv5uhWfQIpdbLcDFo6qCH7pVZAEp4Aogv_j-SRY155_kWlFp3iVRALev_tsoR/exec";
let googleApiAdress;
const employee = document.getElementById("employee");
const cars = document.getElementById("cars");
const streetsList = document.getElementById("streetsList");
const unit = document.getElementById("unit");
const routeCard = document.getElementById("routeCard");
let routeCounter = 0;
const routesContainer = document.getElementById("routesContainer");
const forward = document.querySelector(".forward");
const modalContainer = document.querySelector(".modal__save");
let routeTitles;
const resulBtn = document.getElementById("resulBtn");
const resultsBody = document.getElementById("results");
const searchCardErrore = document.getElementById("searchCardErrore");
const spinner = document.getElementById("spinner");
const searchCardErroreText = document.getElementById("searchCardErroreText");

if (localStorage.getItem("initData")) {
  let initData = JSON.parse(localStorage.getItem("initData"));
  console.log(initData);
  googleApiAdress = initData.city; // Используйте let или var
}

resulBtn.addEventListener("click", () => {
  resultsBody.classList.toggle("active");
});
// функция для получения времени в пути
function getTimeInMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}
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
isSignal();
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
  data.routes = [];
  data.extendedOdometr = [];

  // Получаем данные маршрутов
  document.querySelectorAll("#routesContainer .route").forEach((route) => {
    const inputs = route.querySelectorAll(".input");
    const isCombatBox = route.querySelector(".isCombat__box");
    let isCombat = isCombatBox?.classList.contains("combat") || false;

    const newRoute = {
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
    };

    // Проверяем, есть ли уже такой маршрут в массиве
    const isDuplicate = data.routes.some(
      (route) =>
        route.from === newRoute.from &&
        route.departureTime === newRoute.departureTime &&
        route.to === newRoute.to &&
        route.arrivalTime === newRoute.arrivalTime &&
        route.distance === newRoute.distance &&
        route.purpose === newRoute.purpose
    );

    if (!isDuplicate) {
      data.routes.push(newRoute);
    }
  });

  // Получаем данные километража
  const kilometers = specificKilometer();
  const whoseSingnals = whoseSingnal();
  data.signalHolding = whoseSingnals.signalHolding;
  data.signalVenbest = whoseSingnals.signalVenbest;
  // Добавляем данные в extendedOdometr
  data.extendedOdometr = [
    {
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
    },
  ];

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
  const initData = localStorage.getItem("initData");
  if (initData) {
    const data = JSON.parse(initData);
    // console.log(data, 'initData');
    if (data.columnB) {
      data.columnB.forEach((item) => {
        let newOption = document.createElement("option");
        newOption.value = item;
        employee.appendChild(newOption);
      });
    }
    if (data.columnC) {
      data.columnC.forEach((item) => {
        let newOption = document.createElement("option");
        newOption.value = item;
        cars.appendChild(newOption);
      });
    }
    if (data.columnE) {
      data.columnE.forEach((item) => {
        // let newOption = document.createElement("option");
        // newOption.value = item;
        // streetsList.appendChild(newOption);
      });
      allStreetNames = data.columnE;
      // console.log('allStreetNames',allStreetNames);
    }

    if (data.columnD) {
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
  }
  const savedData = localStorage.getItem("formData");
  if (savedData) {
    const data = JSON.parse(savedData);
    console.log("-------", data, "-------");

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
    container.innerHTML = ``;
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
      if (route.isCombat) {
        routeDiv.classList.add("combat");
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

                    <div class="route__row streetRow" style="position: relative;">
                        <input list="streetsList" class="input req suggestions" data-index="${index}" type="text" placeholder="Звідки" id="from${index + 1
        }" required="" value="${route.from}">
        <ul class="autocomplete-list" id="autocomplete-${index}"></ul>
                        <input class="input req" type="time" required="" value="${route.departureTime
        }">
                    </div>
                    <div class="route__row streetRow" style="position: relative;">
                        <input list="streetsList" class="input req suggestions" data-index="${index + 1
        }" type="text" placeholder="Куди" id="to${index + 1
        }" required="" value="${route.to}">
        <ul class="autocomplete-list" id="autocomplete-${index + 1}"></ul>
                        <input class="input req" type="time" required="" value="${route.arrivalTime
        }">
                    </div>
                    <div class="route__row last" id="last">
                        <input class="input distance req" type="number"  placeholder="Відстань(км)" required=""
                        value="${route.distance}">

                           <select class="input req" id="target${index + 1
        }" required>
                    <option data-toggle="arest${index + 1
        }" value="" selected>                    мета поїздки</option>
                    
                    <option data-toggle="arest${index + 1
        }" data-value="signal" data-valuewhose="signalHolding" value="Спрацювання ОХ">Спрацювання ОХ</option>

                    <option data-toggle="arest${index + 1
        }" data-value="signal" data-valuewhose="signalVenbest" value="Спрацювання Партн.">Спрацювання Партн.</option>
                    <option data-toggle="arest${index + 1
        }"  data-value="point" value="Точка відстою">Точка відстою</option>
                    <option data-toggle="arest${index + 1
        }" data-value="familiarization" value="Ознайомлення">Ознайомлення</option>
                    <option data-toggle="arest${index + 1
        }" data-value="patrol" value="Патруль">Патруль</option>
                    <option data-toggle="arest${index + 1
        }" data-value="breaks" value="Туалет/Обід">Туалет/Обід</option>
                    <option data-toggle="arest${index + 1
        }" data-value="pickupH" value="Підвіз ОХ">Підвіз ОХ</option>
                    <option data-toggle="arest${index + 1
        }" data-value="pickupV" value="Підвіз Партн.">Підвіз Партн.</option>
                    <option data-toggle="arest${index + 1
        }" data-value="wash" value="Мийка">Мийка</option>
                    <option data-toggle="arest${index + 1
        }" data-value="service" value="СТО">СТО</option>                    
                    <option data-toggle="arest${index + 1
        }" data-value="check" value="Перевірка">Перевірка</option>                    
                    <option data-toggle="arest${index + 1
        }" data-value="change" value="Перезмінка">Перезмінка</option>                    
                    <option data-toggle="arest${index + 1
        }" data-value="other" value="Інше">Інше</option>
                  </select>
                  
                      
                        </div>


  <div class="isCombat ${route.purpose.includes("Спрацювання") ? "active" : ""
        }"" id="arest${index + 1}">
  <div class="isCombat__overflow">
    <span>Бойова??</span>
    <div class="isCombat__box ${route.isCombat ? "combat" : ""}"></div>
  </div>
  </div>

                          <div class="arrested ${route.isCombat ? "" : "dn"}"  >


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
              // console.log("!!!!!!!!!!!!!!!!!!!!!!");
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
  document.getElementById("dailyKm").textContent = totalDistance + " км";

  // Рассчитываем и обновляем конечное значение спидометра
  const endOdometer = startOdometer + totalDistance;

  document.getElementById("endOdometerValue").textContent =
    endOdometer.toFixed(1);
  document.getElementById("endOd").textContent = endOdometer.toFixed(1) + " км";
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
    // console.log("ds");

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

                <div class="route__row streetRow" style="position: relative;">
                    <input data-index="${routeCounter}" list="streetsList" class="input req suggestions" type="text" placeholder="Звідки" id="from${routeCounter}" required="" value="">
                    <ul class="autocomplete-list" id="autocomplete-${routeCounter}"></ul>
                    <input class="input req" type="time" required="" value="">
                </div>
                <div class="route__row streetRow" style="position: relative;">
                    <input data-index="${routeCounter + 1
      }" list="streetsList" class="input req suggestions" type="text" placeholder="куди" id="to${routeCounter}"  required="" value="">
                    <ul class="autocomplete-list" id="autocomplete-${routeCounter + 1
      }"></ul>
                    <input class="input req" type="time" required="" value="">
                </div>
                <div class="route__row last" id="last">
                    <input class="input distance req" type="number" placeholder="Відстань(км)" required=""
                    value="">
              
                            <select class="input req" id="target" required>
                    <option data-toggle="arest${routeCounter}" value="" selected>Мета поїздки</option>
                    <option data-toggle="arest${routeCounter}" data-value="signal" value="Спрацювання ОХ" data-valuewhose="signalHolding">Спрацювання ОХ</option>
                    <option data-toggle="arest${routeCounter}" data-value="signal" value="Спрацювання Партн." data-valuewhose="signalVenbest">Спрацювання Партн.</option>
                    <option data-toggle="arest${routeCounter}" data-value="point" value="Точка відстою">Точка відстою</option>
                    <option data-toggle="arest${routeCounter}" data-value="familiarization" value="Ознайомлення">Ознайомлення</option>
                    <option data-toggle="arest${routeCounter}" data-value="patrol" value="Патруль">Патруль</option>
                    <option data-toggle="arest${routeCounter}" data-value="breaks" value="Туалет/Обід">Туалет/Обід</option>
                    <option data-toggle="arest${routeCounter}" data-value="pickupH" value="Підвіз ОХ">Підвіз ОХ</option>
                    <option data-toggle="arest${routeCounter}" data-value="pickupV" value="Підвіз Партн.">Підвіз Партн.</option>
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
      let fromInput = document.getElementById(`from${routeCounter}`);
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
async function handleFormSubmit(api) {
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
  const erBox = document.createElement("div");
  erBox.className = "erBox";
  const support = document.createElement("div");
  support.className = "support";
  support.classList.add("er-bnt");
  support.textContent = "Підтримка";
  support.addEventListener("click", () => {
    location.reload();
  });
  // Собираем финальную структуру
  modalSendForm.appendChild(logo);
  modalSendForm.appendChild(modalMessage);
  modalSendForm.appendChild(lastBtn);
  modalSendForm.appendChild(erBox);
  erBox.appendChild(support);
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
    startOdometer: Math.round(
      parseFloat(document.getElementById("startOdometer").value) || 0
    ),
    routes: [],
    endOdometer: Math.round(
      parseFloat(document.getElementById("endOdometerValue").textContent) || 0
    ),
    signalOdometer: Math.round(
      parseFloat(document.getElementById("signal").textContent) || 0
    ),
    pointOdometer: Math.round(
      parseFloat(document.getElementById("point").textContent) || 0
    ),
    familiarizationOdometer: Math.round(
      parseFloat(document.getElementById("familiarization").textContent) || 0
    ),
    patrolOdometer: Math.round(
      parseFloat(document.getElementById("patrol").textContent) || 0
    ),
    breaksOdometer: Math.round(
      parseFloat(document.getElementById("breaks").textContent) || 0
    ),
    pickupHOdometer: Math.round(
      parseFloat(document.getElementById("pickupH").textContent) || 0
    ),
    pickupVOdometer: Math.round(
      parseFloat(document.getElementById("pickupV").textContent) || 0
    ),
    washOdometer: Math.round(
      parseFloat(document.getElementById("wash").textContent) || 0
    ),
    serviceOdometer: Math.round(
      parseFloat(document.getElementById("service").textContent) || 0
    ),
    checkOdometer: Math.round(
      parseFloat(document.getElementById("check").textContent) || 0
    ),
    changeOdometer: Math.round(
      parseFloat(document.getElementById("change").textContent) || 0
    ),
    otherOdometer: Math.round(
      parseFloat(document.getElementById("other").textContent) || 0
    ),
  };

  document.querySelectorAll("#routesContainer .route").forEach((route) => {
    const inputs = route.querySelectorAll(".input");
    const isCombatBox = route.querySelector(".isCombat__box");
    let isCombat = "нет";
    if (isCombatBox) {
      if (isCombatBox.classList.contains("combat")) {
        isCombat = "да";
        signalsCombat++;
      }
    }

    // console.log(route);

    const arrivalTime = getTimeInMinutes(inputs[3].value);
    const departureTime = getTimeInMinutes(inputs[1].value);
    const travelTime = arrivalTime - departureTime;

    // console.log(`Время в пути: ${travelTime} минут`)
    // console.log(data);
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
      travelTime: travelTime,
    });
  });
  data.signalsCombat = signalsCombat;

  try {
    // console.log("---------------------------");
    // console.log(data);
    // console.log("---------------------------");
    const box = document.querySelector(".box");
    const lastBtn = document.querySelector(".lastBtn");
    let googleApiAdress = api;
    console.log(data);

    const response = await fetch(
      `https://morning-lake-0dfa.kiriluka68.workers.dev/?url=${googleApiAdress}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        // mode: "no-cors", // Запрос с режимом no-cors
      }
    );

    const result = await response.json();

    if (result.status === "success") {
      box.classList.add("finish");
      setTimeout(() => {
        box.innerHTML = `<p>Дякую, дані успішно відправлені!</p> `;
        box.classList.remove("finish");
        lastBtn.classList.add("active");
        lastBtn.addEventListener("click", reload);
      }, 300);
    } else {
      // alert(`Ошибка1: ${result.message}`);
      console.log("ошибка 1");
      erBox.classList.add("active");
      box.innerHTML = `<p>Помилка1! <br/> <span> ${result.message}</span></p>`;
    }
  } catch (error) {
    console.log(error);
    // alert(`Ошибка2: ${error}`);
    console.log("ошибка 2");
    erBox.classList.add("active");
    box.innerHTML = `<p>Помилка2! <br/> <span>${error}</span></p>`;
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

// Слушаем изменения на всех инпутах и селектах
function saveinchange() {
  // console.log("save");

  document.querySelectorAll("input, select,textarea").forEach((element) => {
    element.addEventListener("input", saveToLocalStorage); // Для инпутов
    element.addEventListener("change", saveToLocalStorage); // Для селектов
  });
}

document.addEventListener("click", (event) => {
  let isCombat = event.target;
  // Проверяем, что клик был по элементу с классом isCombat
  if (isCombat.classList.contains("isCombat__box")) {
    // Удаляем класс combat у всех элементов, если нужно

    // Добавляем класс combat только текущему элементу
    isCombat.classList.toggle("combat");
    const routeDiv = isCombat.closest(".route");
    const arestedBox = routeDiv.querySelector(".arrested");
    const arestedInputs = arestedBox.querySelectorAll("input");

    let isCombatBox = isCombat.closest(".isCombat");
    let arrested = isCombatBox?.nextElementSibling;
    routeDiv.classList.toggle("combat");
    arestedInputs.forEach((input) => {
      input.value = 0;
    });
    if (arrested && arrested.classList.contains("arrested")) {
      arrested.classList.toggle("dn");
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
      const modalDelete = document.querySelector(".modal__delete");
      let routeBox = event.target.closest(".route");

      // console.log(routeBox);
      modalDelete.classList.remove("dn");

      // Получаем кнопки
      const buttonCancel = document.querySelector(".buttonCancel");
      const buttonDelete = document.querySelector(".buttonDelete");

      // Удаляем предыдущие обработчики событий (если они есть)
      buttonCancel.replaceWith(buttonCancel.cloneNode(true));
      buttonDelete.replaceWith(buttonDelete.cloneNode(true));

      // Заново получаем новые элементы после замены
      const newButtonCancel = document.querySelector(".buttonCancel");
      const newButtonDelete = document.querySelector(".buttonDelete");

      // Добавляем обработчики для новых кнопок
      newButtonCancel.addEventListener("click", () => {
        modalDelete.classList.add("dn");
      });

      newButtonDelete.addEventListener("click", () => {
        routeCounter--;
        routeBox.remove();
        modalDelete.classList.add("dn");
        // Обновляем значение конечного спидометра после удаления маршрута
        updateEndOdometer();
        saveToLocalStorage();
      });
    }
  });

saveinchange();

const buttonSendCancel = document.getElementById("buttonSend-Cancel");
const buttonSendSend = document.getElementById("buttonSend-Send");
const modalSend = document.getElementById("modalSend");
const submit = document.querySelector(".btn--send");

submit.addEventListener("click", (e) => {
  e.preventDefault();

  let er = [];
  let req = document.querySelectorAll(".req");
  let allBox = document.querySelectorAll(".route");

  // Скрытие всех родительских элементов до проверки
  if (allBox) {
    allBox.forEach((box) => {
      let boxTitle = box.querySelector(".route__title");
      let boxBody = box.querySelector(".route__row-box");
      boxTitle.classList.remove("active");
      boxBody.classList.remove("active");
    });
  }

  // Проверка всех обязательных полей
  for (let input of req) {
    input.classList.remove("errore");
    if (input.value.trim() === "") {
      input.classList.add("errore");
      let box = input.closest(".route");

      if (box) {
        let boxTitle = box.querySelector(".route__title");
        let boxBody = box.querySelector(".route__row-box");
        boxTitle.classList.add("active");
        boxBody.classList.add("active");
      }

      // Прокрутка к первому пустому полю
      const rect = input.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + rect.top - 75, // Прокрутка на 75 пикселей выше
        behavior: "smooth", // Плавная прокрутка
      });

      er.push(input);
      break; // Прерываем цикл, если нашли первое пустое поле
    }
  }

  console.log(er);

  if (er.length == 0) {
    modalSend.classList.remove("dn");
  }
});

buttonSendSend.addEventListener("click", (e) => {
  handleFormSubmit(googleApiAdress);
});
buttonSendCancel.addEventListener("click", () => {
  modalSend.classList.add("dn");
});

const tgLink = document.querySelector(".tgLink");
tgLink.addEventListener("click", () => {
  if (window.cordova && window.cordova.InAppBrowser) {
    window.cordova.InAppBrowser.open("https://t.me/Alexandrr32", "_system"); // Открытие ссылки в стандартном браузере
  } else {
    window.open("https://t.me/Alexandrr32", "_blank");
  }
});
const checCard = document.querySelector("#searchCard__value");
const buttonCheck = document.querySelector("#searchCard__btn");

// buttonCheck.addEventListener("click", () => {
//   let value = checCard.value.toUpperCase().replace(/\s+/g, '');

//   if (value !== "") {
//     let pdfUrl = `https://l-cs.ohholding.com.ua/storage//object_cards/pdf/2/${value}.pdf`;

//     // Используем InAppBrowser для открытия ссылки на мобильных устройствах
//     if (window.cordova && window.cordova.InAppBrowser) {
//       window.cordova.InAppBrowser.open(pdfUrl, '_system');  // Открытие ссылки в стандартном браузере
//     } else {
//       window.open(pdfUrl, "_blank");
//     }

//   }
// });

// Логика поиска карточек **************************************

// Глобальные переменные для функций-обработчиков
let handleRouteClick = null;
let openPdf = null;

const myHeaders = new Headers();
myHeaders.append("Authorization", "Basic YS5raXJpbHVrOm03OTdnTGZaOEo=");
myHeaders.append("Accept", "application/json");

buttonCheck.addEventListener("click", () => {
  const routeRoute = document.getElementById("routeRoute");
  const nameCard = document.getElementById("nameCard");
  const nameClient = document.getElementById("nameClient");
  const adressCard = document.getElementById("adressCard");
  nameClient.textContent = ``;
  nameCard.textContent = ``;
  adressCard.textContent = ``;

  let value = checCard.value.toUpperCase().replace(/\s+/g, "");
  if (!searchCardErroreText.classList.contains("dn")) {
    searchCardErroreText.classList.add("dn");
  }
  if (!spinner.classList.contains("dn")) {
    spinner.classList.add("dn");
  }

  routeRoute.classList.remove("active");
  routeCard.classList.remove("active");
  // поиск карточки
  let cardData = ``;

  if (value !== "") {
  }
  // поиск координат

  if (value !== "") {
    cardData = `https://l-cs.ohholding.com.ua/api/v2/object-card/by-account-number/${value}`;

    spinner.classList.remove("dn");
    searchCardErrore.textContent = `${value}`;

    fetch(cardData, {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    })
      .then((response) => {
        // Проверка на успешный ответ (status 200)
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Используем .json() для автоматического парсинга
      })
      .then((result) => {
        console.log("resultSearch:", result);

        const data = result.data;
        // Теперь можно работать с объектом, например:
        if (data.length > 0) {
          // console.log('estm');
          spinner.classList.add("dn");
          console.log(data);
          console.log(data[0].coordinates.lat);

          // routeCard.classList.add("active");
          nameClient.textContent = `${data[0].client_name}`;
          nameCard.textContent = `${data[0].object_title}`;
          adressCard.textContent = `${data[0].object_address}`;

          // const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=YOUR_ORIGIN&destination=${data[0].coordinates.lat},${data[0].coordinates.lng}`;
          if (data[0].coordinates.lat) {
            console.log("coordinaty");

            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${data[0].coordinates.lat},${data[0].coordinates.lng}`;

            // Удаляем старые обработчики
            if (handleRouteClick)
              routeRoute.removeEventListener("click", handleRouteClick);

            handleRouteClick = () => {
              if (window.cordova && window.cordova.InAppBrowser) {
                window.cordova.InAppBrowser.open(googleMapsUrl, "_system");
              } else {
                window.open(googleMapsUrl, "_blank");
              }
            };
            routeRoute.classList.add("active");
            routeRoute.addEventListener("click", handleRouteClick);

            if (openPdf) routeCard.removeEventListener("click", openPdf);
            // object_card_url
          } else {
            console.log("coord net");
          }
          if (data[0].object_card_url !== null) {
            console.log(data[0].object_card_url);

            let pdfUrl = `${data[0].object_card_url}`;

            // Создаём новый обработчик для открытия PDF
            openPdf = () => {
              if (window.cordova && window.cordova.InAppBrowser) {
                window.cordova.InAppBrowser.open(pdfUrl, "_system");
              } else {
                window.open(pdfUrl, "_blank");
              }
            };

            routeCard.classList.add("active");
            routeCard.addEventListener("click", openPdf);
          }
        } else {
          console.log("net");

          spinner.classList.add("dn");
          searchCardErroreText.classList.remove("dn");
        }
      })
      .catch((error) => {
        console.error("Ошибка:", error); // Логируем ошибку, если она есть

        searchCardErroreText.classList.remove("dn");

        spinner.classList.add("dn");
      });
  }
});

// тестовые маршруты
const testData = function () {
  setTimeout(() => {
    const unit = document.getElementById("unit");
    const date = document.getElementById("date");
    const car = document.getElementById("car");
    const driver = document.getElementById("driver");
    const senior = document.getElementById("senior");
    const startOdometer = document.getElementById("startOdometer");
    unit.selectedIndex = 1;
    date.value = "2025-11-11";
    car.value = "Car";
    driver.value = "driver";
    senior.value = "senior";
    startOdometer.value = 55;
    for (let i = 0; i < 15; i++) {
      const routeDiv = document.createElement("div");
      routeDiv.classList.add("route");

      routeDiv.innerHTML = `
        <div class="route__title" data-toggle="box${i + 1}">
        <h2>Поїздка <span>${i + 1}</span> </h2>
        <div class="route__hide">Згорнути</div>
      
        </div>
        <div class="route__row-box "  id="box${i + 1}">
        <div>
            <div class="hide__box">
      
                <div class="route__row streetRow" style="position: relative;">
                    <input data-index="${i}" list="streetsList" class="input req suggestions"  type="text" placeholder="Звідки" id="from${i + 1
        }" required="" value="dc">
          <ul class="autocomplete-list" id="autocomplete-${i}"></ul>

                    <input class="input req" type="time" required="" value="14:30">
                </div>
                <div class="route__row streetRow" style="position: relative;">
                    <input data-index="${i + 1
        }" list="streetsList" class="input req suggestions" type="text" placeholder="Куди" id="to${i + 1
        }" required="" value="dfgdfg">
          <ul class="autocomplete-list" id="autocomplete-${i + 1}"></ul>

                    <input class="input req" type="time" required=""  value="14:30">
                </div>
                <div class="route__row last" id="last">
                    <input class="input distance req" type="number"  placeholder="Відстань(км)" required=""
                    value="1212">
      
                       <select class="input req" id="target${i + 1}" required>
                <option data-toggle="arest${i + 1
        }" value="" selected>                    мета поїздки</option>
                
                <option data-toggle="arest${i + 1
        }" data-value="signal" selected data-valuewhose="signalHolding" value="Спрацювання ОХ">Спрацювання ОХ</option>
      
                <option data-toggle="arest${i + 1
        }" data-value="signal" data-valuewhose="signalVenbest" value="Спрацювання Партн.">Спрацювання Партн.</option>
                <option data-toggle="arest${i + 1
        }"  data-value="point" value="Точка відстою">Точка відстою</option>
                <option data-toggle="arest${i + 1
        }" data-value="familiarization" value="Ознайомлення">Ознайомлення</option>
                <option data-toggle="arest${i + 1
        }" data-value="patrol" value="Патруль">Патруль</option>
                <option data-toggle="arest${i + 1
        }" data-value="breaks" value="Туалет/Обід">Туалет/Обід</option>
                <option data-toggle="arest${i + 1
        }" data-value="pickupH" value="Підвіз ОХ">Підвіз ОХ</option>
                <option data-toggle="arest${i + 1
        }" data-value="pickupV" value="Підвіз Партн.">Підвіз Партн.</option>
                <option data-toggle="arest${i + 1
        }" data-value="wash" value="Мийка">Мийка</option>
                <option data-toggle="arest${i + 1
        }" data-value="service" value="СТО">СТО</option>                    
                <option data-toggle="arest${i + 1
        }" data-value="check" value="Перевірка">Перевірка</option>                    
                <option data-toggle="arest${i + 1
        }" data-value="change" value="Перезмінка">Перезмінка</option>                    
                <option data-toggle="arest${i + 1
        }" data-value="other" value="Інше">Інше</option>
              </select>
              
                  
                    </div>
      
      
      <div class="isCombat" id="arest${i + 1}">
      <div class="isCombat__overflow">
      <span>Бойова??</span>
      <div class="isCombat__box"></div>
      </div>
      </div>
      
                      <div class="arrested"  >
      
      
      <div class="overflow">
      
              <div class="arrested__row">
                <span>Затримано</span>
                <input class="input req" value="45" type="number" id="arest">
              </div>
              <div class="arrested__row">
                <span>передано до полиції</span>
                <input class="input req" value="42" type="number" >
              </div>
      </div>
      
            </div>
      
      
      
                    <div class="route__row">
                    <textarea  class="input"  placeholder="Примітки..." id="message" cols="20" rows="5">ghj</textarea>
                </div>
        
                <button type="button" class="deleteRoute">Видалити</button>
            </div>
      
        </div>
      </div>
        `;
      const container = document.querySelector("#routesContainer");

      container.appendChild(routeDiv);
    }
  }, 2500);
};

// Выбор города начало
const modalCities = document.querySelector(".modal__cities");

if (localStorage.getItem("initData")) {
  let initData = JSON.parse(localStorage.getItem("initData"));
  if (initData && initData.city) {
    modalCities.classList.add("dn");
    //  testData()
  }
}
const citiesItems = document.querySelectorAll(".modal__cities-item");
const selectCityBtn = document.getElementById("selectCityBtn");
const selectedCitySpan = document.querySelector(".selectedCitySpan");

let selectedCity;
function activateButton() {
  selectCityBtn.disabled = false;
  selectCityBtn.classList.add("active");
}

// Функция для деактивации кнопки
function deactivateButton() {
  selectCityBtn.disabled = true;
  selectCityBtn.classList.remove("active");
  selectedCity = "";
}
citiesItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Убираем класс 'selected' у всех городов
    if (item.classList.contains("selected")) {
      item.classList.remove("selected");
      deactivateButton();
      selectedCitySpan.textContent = ``;
      console.log(selectedCity);
    } else {
      citiesItems.forEach((city) => city.classList.remove("selected"));
      selectedCity = item.getAttribute("data-city");
      if (selectedCity == "zp") {
        selectedCitySpan.textContent = `ЗАПОРІЖЖЯ`;
      }
      if (selectedCity == "dp") {
        selectedCitySpan.textContent = `ДНІПРО`;
      }
      if (selectedCity == "kr") {
        selectedCitySpan.textContent = `КРИВИЙ РІГ`;
      }
      if (selectedCity == "kv") {
        selectedCitySpan.textContent = `КИЇВ`;
      }
      item.classList.add("selected");
      console.log(selectedCity);

      // Активируем кнопку
      activateButton();

      document.getElementById("selectCityBtn").scrollIntoView({
        behavior: "smooth", // Плавная прокрутка
        block: "start", // Прокрутка к началу элемента
      });
    }
  });
});

// Обработчик для клика на кнопку
selectCityBtn.addEventListener("click", () => {
  console.log(localStorage.getItem("initData"));

  // Получаем данные из localStorage и преобразуем их в объект

  // Устанавливаем googleApiAdress в зависимости от выбора
  if (selectedCity === "zp") {
    googleApiAdress = zp;
    localStorage.setItem("cityId", 2);
    localStorage.setItem("lat", 47.8388);
    localStorage.setItem("long", 35.1396);
  } else if (selectedCity === "dp") {
    googleApiAdress = dp;
    localStorage.setItem("cityId", 3);
    localStorage.setItem("lat", 48.4647);
    localStorage.setItem("long", 35.0462);
  } else if (selectedCity === "kr") {
    googleApiAdress = kr;
    localStorage.setItem("cityId", 8);
    localStorage.setItem("lat", 47.9105);
    localStorage.setItem("long", 33.3918);
  }else if (selectedCity === "kv") {
    googleApiAdress = kv;
    localStorage.setItem("cityId", 1);
    localStorage.setItem("lat",50.4501);
    localStorage.setItem("long", 30.5234);
  }


  // Добавляем новое свойство в объект

  // Сохраняем обновленный объект обратно в localStorage

  modalCities.classList.add("dn");
  load.classList.remove("finish");

  console.log(selectedCity);
  dataFromGoogle(googleApiAdress);
  loadFromLocalStorage();
  // testData()
});

// Выбор города конец
// console.log(allStreetNames.length);

document.addEventListener("input", (e) => {
  if (e.target.classList.contains("suggestions")) {
    const value = e.target.value.toLowerCase();
    const index = e.target.getAttribute("data-index");
    console.log("index", index);

    const listEl = document.getElementById(`autocomplete-${index}`);

    listEl.innerHTML = "";
    // console.log('allStreetNames',allStreetNames);

    if (!value) {
      listEl.style.display = "none";
      return;
    }

    const matches = allStreetNames.filter((item) =>
      item.toLowerCase().includes(value)
    );

    matches.slice(0, 10).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.addEventListener("click", () => {
        e.target.value = item;
        listEl.style.display = "none";
      });
      listEl.appendChild(li);
    });

    listEl.style.display = matches.length ? "block" : "none";
  }
});

///////////////////////

// DOM элементы
const routBtn = document.querySelector(".routBtn");
const mapBtn = document.querySelector(".mapBtn");
const routsBox = document.querySelector(".routsBox");
const mapBox = document.getElementById("map");
const locateMeBtn = document.getElementById("locateMeBtn");
const filterSelect = document.getElementById("filterSelect");
const selectBox = document.querySelector('.selectBox');

let map,
  markers,
  mapInitialized = false;
let objects = [];
const cityId = localStorage.getItem("cityId") || "2";
fetch(
  `https://l-cs.ohholding.com.ua/api/v2/object-card/coordinate/by-region/${cityId}`,
  {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  }
)
  .then((response) => {
    if (!response.ok) throw new Error("Error seti: " + response.status);
    return response.json();
  })
  .then((data) => {
    console.log("data obj zp", data);
    objects = data.data;
    console.log('objects:', objects);




    

    document.querySelector(".mapBtn").classList.remove("hide");

    // Унікальні gbr_rezerv
    const uniqueReservs = [
      ...new Set(objects.map((obj) => obj.gbr).filter(Boolean)),
    ];
    uniqueReservs.forEach((reserv) => {
      const option = document.createElement("option");
      option.value = reserv;
      option.textContent = reserv;
      filterSelect.appendChild(option);
    });

    // Слухач зміни селектора
    filterSelect.addEventListener("change", (e) => {
      renderMarkers(e.target.value);
    });

    // Кнопки перемикання
    mapBtn.addEventListener("click", () => {
      routsBox.classList.add("hide");
      selectBox.classList.remove('dnone')
      mapBox.classList.remove("dnone");
      setTimeout(() => {
        routsBox.classList.add("dnone");
        mapBox.classList.remove("hide");
        selectBox.classList.remove('hide')

        if (!mapInitialized) {
          initMap();
          mapInitialized = true;
        } else {
          map.invalidateSize();
        }
      }, 300);
    });

    routBtn.addEventListener("click", () => {
      mapBox.classList.add("hide");
      selectBox.classList.add('hide')
      routsBox.classList.remove("dnone");
      setTimeout(() => {
        mapBox.classList.add("dnone");
        selectBox.classList.add('dnone')
        routsBox.classList.remove("hide");
      }, 300);
    });
    let lat = localStorage.getItem("lat") || 47.8388;
    let long = localStorage.getItem("long") || 35.1396;
    function initMap() {
      map = L.map("map").setView([lat, long], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Map data © OpenStreetMap contributors",
      }).addTo(map);

      markers = L.markerClusterGroup();
      map.addLayer(markers);

      renderMarkers();

      // Геолокація
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          const userMarker = L.marker([userLat, userLon], {
            title: "Ви тут",
            icon: L.icon({
              iconUrl:
                "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            }),
          }).addTo(map);

          map.setView([userLat, userLon], 13);
        },
        () => console.warn("Геолокація недоступна")
      );
    }

    function renderMarkers(filterValue = "all") {
      markers.clearLayers();

      objects.forEach((obj, i) => {
        const lat = parseFloat(obj.coordinates.lat);
        const lng = parseFloat(obj.coordinates.lng);

        if (!isNaN(lat) && !isNaN(lng)) {
          if (filterValue === "all" || obj.gbr === filterValue) {
            const marker = L.marker([lat, lng]);
            marker.bindPopup(
              `<b>${obj.account_number} </b><br>
              ${obj.object_title} <br>
              ${obj.object_address}<br>
                <button onclick="routeTo(${lat}, ${lng})">Скласти маршрут</button>`
            );
            markers.addLayer(marker);
          }
        } else {
          console.error("Некоректні координати:", obj.coordinates);
        }
      });
    }

    // Кнопка "Знайти мене"
    // locateMeBtn.addEventListener("click", () => {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       const userLat = position.coords.latitude;
    //       const userLon = position.coords.longitude;

    //       map.setView([userLat, userLon], 15);

    //       const circle = L.circle([userLat, userLon], {
    //         color: "blue",
    //         fillColor: "#30f",
    //         fillOpacity: 0.3,
    //         radius: 100,
    //       }).addTo(map);

    //       setTimeout(() => map.removeLayer(circle), 5000);
    //     },
    //     (error) => {
    //       console.log(error);
    //       alert(`Помилка геолокації (${error.code}): ${error.message}`);
    //     }
    //   );
    // });
  });
