// Создание БД
const API = "http://localhost:8000/students";
// Сохраняем в переменные все инпуты и кнопки для ввода данных
let inpName = document.getElementById("inpTitle");
let inpNumber = document.getElementById("inpNumber");
let inpImg = document.getElementById("inpImg");
let inpWeekKpi = document.getElementById("inpWeekKpi");
let inpMonthKpi = document.getElementById("inpMonthKpi");
let btnAdd = document.getElementById("btnAdd");
let searchValue = "";
let sectionStudents = document.getElementById("sectionStudents");
let currentPage = 1;
let limitPage = 1;
// Навешиваем событие на кнопку btnAdd
btnAdd.addEventListener("click", () => {
  if (
    !inpName.value.trim() ||
    !inpNumber.value.trim() ||
    !inpImg.value.trim() ||
    !inpWeekKpi.value.trim() ||
    !inpMonthKpi.value.trim()
  ) {
    return alert("Заполните все поля!");
  }
  let newStudent = {
    studentName: inpName.value,
    studentNumber: inpNumber.value,
    studentImg: inpImg.value,
    studentWeekKpi: inpWeekKpi.value,
    studentMonthKpi: inpMonthKpi.value,
  };
  createStudent(newStudent);
});
//! CREATE
function createStudent(studentObj) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(studentObj),
  }).then(() => readStudents());
  inpName.value = "";
  inpNumber.value = "";
  inpImg.value = "";
  inpWeekKpi.value = "";
  inpMonthKpi.value = "";
}
//! ====read=====
// Создаем функцию для отображение данных
function readStudents() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=4`)
    .then((res) => res.json())
    .then((data) => {
      sectionStudents.innerHTML = "";
      data.forEach((item) => {
        // перебираем наш полученный массив с объектами
        // добаляем в наш тег section верстку при каждом цикле
        sectionStudents.innerHTML += `
             <div  data-aos="flip-left"
             data-aos-easing="ease-out-cubic"
             data-aos-duration="2000">
          <div class="card m-4 cardBook card" style="width: 18rem">
          <img id="${item.id}" src="${item.studentImg}" class="card-img-top detailsCard" style="height: 280px" alt="image" />
        <div class="card-body">
          <h5 class="card-title">${item.studentName}</h5>
          <p class="card-text para">
            ${item.studentNumber}
          </p>
          <h6> Недельный KPI: ${item.studentWeekKpi} </h6>
          <h6> Месячный KPI: ${item.studentMonthKpi} </h6>
          <button class="btn btn-outline-danger btnDelete" id="${item.id}">
              Delete
            </button>
            <button type="button" class="btn btn-warning btnEdit" id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Edit
          </button>
          
        </div>
      </div>
          </div>`;
      });
    });
  getCount();
}
readStudents(); // один раз вызываем функцию отображения данных для того чтобы при первом посещании сайта данные отобразились

// ! ============== DELETE ===================
// Событие на кнопку Delete
document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList]; // Сохраняем массив с классами в переменную
  if (del_class.includes("btnDelete")) {
    // проеверяем есть ли в нашем поиске класс btnDelete
    let del_id = e.target.id; // сохраняем id эелемента по которому кликнули
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readStudents());
  }
});
//! ======EDIT=============

let editInpName = document.getElementById("editInpName");
let editInpNumber = document.getElementById("editInpNumber");
let editInpImg = document.getElementById("editInpImg");
let editInpWeekKpi = document.getElementById("editInpWeekKpi");
let editInpMonthKpi = document.getElementById("editInpMonthKpi");
let editBtnSave = document.getElementById("btnEditSave");
let editBtnClose = document.getElementById("btnEditClose");
// СОбытие на кнопку edit

document.addEventListener("click", (e) => {
  let arr = [...e.target.classList];
  if (arr.includes("btnEdit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpName.value = data.studentName;
        editInpNumber.value = data.studentNumber;
        editInpImg.value = data.studentImg;
        editInpWeekKpi.value = data.studentWeekKpi;
        editInpMonthKpi.value = data.studentMonthKpi;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});
editBtnSave.addEventListener("click", () => {
  let editedStudents = {
    studentName: editInpName.value,
    studentNumber: editInpNumber.value,
    studetImg: editInpImg.value,
    studentWeekKpi: editInpWeekKpi.value,
    studentMonthKpi: editInpMonthKpi.value,
  };
  editStudent(editedStudents, editBtnSave.id);
});
function editStudent(editObj, id) {
  console.log(id);
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(editObj),
  }).then(() => readStudents());
}
//! ======EDIT FINISH=============
//? =====Search==============

let inpSearch = document.getElementById("inpSearch");
let btnSearch = document.getElementById("btnSearch");
inpSearch.addEventListener("input", (e) => {
  console.log(e.target.value);
  searchValue = e.target.value;
  readStudents();
});
//? ========Search Finish===========

//!===========Pagination===========
let prvBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");

function getCount() {
  //   let pages = 1;
  fetch(API)
    .then((res) => res.json())
    .then((data) => (limitPage = Math.ceil(data.length / 4)));
}

// async function getCount() {
//   let result = await fetch(API);
//   let data = await result.json();
//   let length = await data.length;
//   return length;
// }

// console.log(getCount().then((res) => console.log(res)));

prvBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  console.log(limitPage);
  readStudents();
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= limitPage) return;
  currentPage++;
  readStudents();
  console.log(limitPage);
});
