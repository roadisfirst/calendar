let today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthAndYear = document.getElementById("monthAndYear");
const modalFrame = document.getElementById("modalFrame");
const area = document.getElementById("area");
const buttonOk = document.getElementById("ok");
const buttonCancel = document.getElementById("cancel");
const calendar = document.getElementById("calendar");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const spanClose = document.getElementById("spanClose");

showCalendar (currentMonth, currentYear);
choseDay();

// using event delegation
function choseDay() {
    calendar.onclick = function(event) {
        let td = event.target.closest('td');
        if ((!td) || (!calendar.contains(td))) return;
        if(td.innerHTML != ''){
            readFromStorage(td);
        }
    };
}
/*function choseDay(){
    let tds = document.querySelectorAll("#calendar td");
    for (let i=0; i<tds.length; i++){
        if(tds[i].innerHTML != ''){
            tds[i].onclick = function () { readFromStorage(tds[i]); }
        }
    }
} */

function saveToStorage(){
    let selectedDay = buttonOk.getAttribute('data-date');
    const selectedCell = document.querySelector(`#calendar [data-date = "${selectedDay}"]`);
    if(area.value !==""){
        localStorage.setItem(selectedDay, area.value);
        selectedCell.classList.add("noted");
    }
    if(area.value === ""){ deleteFromStorage()};
    modalFrame.classList.remove("active");
    
}

function readFromStorage(cell){
    area.value = localStorage.getItem(cell.getAttribute('data-date'));
    modalFrame.classList.add("active");
    buttonOk.setAttribute('data-date', cell.getAttribute('data-date'));
    let modalTitle = modalFrame.getElementsByClassName('modal-title')[0];
    modalTitle.innerHTML = buttonOk.getAttribute('data-date');
}

function deleteFromStorage(){
    let selectedDay = buttonOk.getAttribute('data-date');
    const selectedCell = document.querySelector(`#calendar [data-date = "${selectedDay}"]`);
    localStorage.removeItem(selectedDay);
    selectedCell.classList.remove("noted");
}

function nextMonth(){
    if (currentMonth === 11){
        currentYear +=1;
    }
    currentMonth = (currentMonth + 1) % 12;
    showCalendar (currentMonth, currentYear);
}

function previousMonth(){
    if (currentMonth === 0){
        currentYear -=1;
        currentMonth = 11;
    } else {
        currentMonth -= 1;
    }
    showCalendar (currentMonth, currentYear);
}

function jump(){
    currentMonth = parseInt(selectMonth.value);
    currentYear = parseInt(selectYear.value);
    showCalendar (currentMonth, currentYear);
}

function showCalendar(month, year){
    let firstDay = (new Date(year, month)).getDay();
    if (firstDay === 0) firstDay = 7;  // для начала недели с Пн
    const daysInMonth = (new Date(year, month + 1, 0)).getDate();
    const tbl = document.getElementById("calendar-body");
    tbl.innerHTML = "";
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    //создание ячеек
    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");

        for (let j = 1; j <= 7; j++){
            if (i === 0 && j < firstDay){ //создание пустых ячеек до нужного дня недели
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else if (date > daysInMonth) { //проверка конца месяца
                break;
            } else { //заполнение датами с нужного дня недели
                let cell = document.createElement("td");
                let cellText = document.createTextNode(date);
                cell.classList.add("calendar-days"); 
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()){
                    cell.classList.add("highlighted"); //подсветить сегодня
                }
                
                let atribute = year + '-' + (month+1) + '-' + date;
                cell.dataset.date = atribute;//добавление дата атрибута для каждой даты
                if (localStorage.getItem(atribute) !== null){
                    cell.classList.add("noted");  //подсвечивать дни с заметками
                }
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }   
        }
        tbl.appendChild(row);
    }
    //choseDay();
}

function closeModalFrame(){
    modalFrame.classList.remove("active");
}

buttonOk.addEventListener("click", saveToStorage);
next.addEventListener("click", nextMonth);
previous.addEventListener("click", previousMonth);

[buttonCancel, spanClose].forEach(function(element) {
    element.addEventListener("click", closeModalFrame);
 });