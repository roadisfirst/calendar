let today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let monthAndYear = document.getElementById("monthAndYear");
let modalFrame = document.getElementById("modalFrame");
let area = document.getElementById("area");
let buttonOk = document.getElementById("ok");

showCalendar (currentMonth, currentYear);
choseDay();

function choseDay(){
    let tds = document.querySelectorAll("#calendar td");
    for (let i=0; i<tds.length; i++){
        if(tds[i].innerHTML != ''){
            //tds[i].onclick=function() { alert(this.innerHTML + " " + this.getAttribute('data-date')); }
            tds[i].onclick = function () { readFromStorage(tds[i]); }
        }
    }
} 

function saveToStorage(){
    let selectedDay = buttonOk.getAttribute('data-date');
    let calendarElements = document.querySelector("#calendar");
    let selectedCell = calendarElements.querySelector(`[data-date = "${selectedDay}"]`);
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
    var modalTitle = modalFrame.getElementsByClassName('modal-title')[0];
    modalTitle.innerHTML = buttonOk.getAttribute('data-date');
}

function deleteFromStorage(){
    let selectedDay = buttonOk.getAttribute('data-date');
    let calendarElements = document.querySelector("#calendar");
    let selectedCell = calendarElements.querySelector(`[data-date = "${selectedDay}"]`);
    localStorage.removeItem(selectedDay);
    selectedCell.classList.remove("noted");
}

function next(){
    if (currentMonth === 11){
        currentYear +=1;
    }
    currentMonth = (currentMonth + 1) % 12;
    showCalendar (currentMonth, currentYear);
}

function previous(){
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
    let daysInMonth = (new Date(year, month + 1, 0)).getDate();
    let tbl = document.getElementById("calendar-body");
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
    choseDay();
}

function closeModalFrame(){
    modalFrame.classList.remove("active");
}

