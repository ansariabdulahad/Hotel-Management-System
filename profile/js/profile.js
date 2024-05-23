// all global variables declaration
let userInfo;
let user;
let allBData = [];
let allInHData = [];
let allArchData = [];

let navBrand = document.querySelector('.navbar-brand');
let logoutBtn = document.querySelector('.logout-btn');
let modalCBtn = document.querySelectorAll('.btn-close');

let bookingForm = document.querySelector('.booking-form');
let allBInput = bookingForm.querySelectorAll('input');
let bTextarea = bookingForm.querySelector('textarea');
let bListTBody = document.querySelector('.booking-list');
let bRegBtn = document.querySelector('.b-register-btn');

let inHouseForm = document.querySelector('.inhouse-form');
let allInHInput = inHouseForm.querySelectorAll('input');
let inHTextarea = inHouseForm.querySelector('textarea');
let inHListTBody = document.querySelector('.inhouse-list');
let inHRegBtn = document.querySelector('.in-house-reg-btn');

// check user is login or not
if (sessionStorage.getItem('__au__') == null) {
    window.location = '../../index.html';
}
userInfo = JSON.parse(sessionStorage.getItem('__au__'));
navBrand.innerHTML = userInfo.hotelName;

user = userInfo.email.split('@')[0];

// getting data from storage
const fetchData = (key) => {
    if (localStorage.getItem(key) != null) {
        let data = JSON.parse(localStorage.getItem(key));
        return data;
    }
    else {
        return [];
    }
}

// Read localStorage data and store it in array to stay consistent
allBData = fetchData(user + '_allBData');
allInHData = fetchData(user + '_allInHData');
allArchData = fetchData(user + '_allArchData');

// format date function
const formatDate = (data, isTime) => {
    let date = new Date();
    let yy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    let time = date.toLocaleTimeString();

    dd = dd < 10 ? '0' + dd : dd
    mm = mm < 10 ? '0' + mm : mm

    return `${dd}-${mm}-${yy} ${isTime ? time : ''}`;
}

// Registration coding
const registrationFunc = (textarea, inputs, array, key) => {
    let data = {
        notice: textarea.value,
        createdAt: new Date()
    }

    for (let el of inputs) {
        let key = el.name;
        let value = el.value;

        data[key] = value;
    }

    array.push(data);
    localStorage.setItem(key, JSON.stringify(array));
    Swal.fire({
        title: "Good job!",
        text: "Registration completed successfully !",
        icon: "success"
    });
}

// Delete coding
const deleteDataFunc = (element, array, key) => {
    let allDelBtn = element.querySelectorAll('.del-btn');

    allDelBtn.forEach((btn, index) => {
        btn.onclick = () => {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    array.splice(index, 1);
                    localStorage.setItem(key, JSON.stringify(array));
                    ShowData(element, array, key);

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your Data has been deleted.",
                        icon: "success"
                    });
                }
            });
        }
    })
}

// Update Coding
const updateDataFunc = (element, array, key) => {
    let allEditBtn = element.querySelectorAll('.edit-btn');
    allEditBtn.forEach((btn, index) => {
        btn.onclick = () => {
            let tmp = key.split('_')[1];
            tmp == 'allBData' ? bRegBtn.click() : inHRegBtn.click();
            let allBtn = tmp == 'allBData'
                ? bookingForm.querySelectorAll('button')
                : inHouseForm.querySelectorAll('button');
            allBtn[0].classList.add('d-none');
            allBtn[1].classList.remove('d-none');

            let allInput = tmp == 'allBData'
                ? bookingForm.querySelectorAll('input')
                : inHouseForm.querySelectorAll('input');

            let textarea = tmp == 'allBData'
                ? bookingForm.querySelector('textarea')
                : inHouseForm.querySelector('textarea');

            let obj = array[index];
            allInput[0].value = obj.fullname;
            allInput[1].value = obj.location;
            allInput[2].value = obj.roomNo;
            allInput[3].value = obj.totalPeople;
            allInput[4].value = obj.checkInDate;
            allInput[5].value = obj.checkOutDate;
            allInput[6].value = obj.price;
            allInput[7].value = obj.mobile;
            textarea.value = obj.notice;

            allBtn[1].onclick = () => {
                let formData = {
                    notice: textarea.value,
                    createdAt: new Date()
                }

                for (let el of allInput) {
                    let key = el.name;
                    let value = el.value;
                    formData[key] = value;
                }

                array[index] = formData;
                allBtn[0].classList.remove('d-none');
                allBtn[1].classList.add('d-none');
                tmp == 'allBData' ? bookingForm.reset() : inHouseForm.reset();
                tmp == 'allBData' ? modalCBtn[0].click() : modalCBtn[1].click();
                localStorage.setItem(key, JSON.stringify(array));
                ShowData(element, array, key);
            }
        }
    })
}

// Check in and Check out coding
const checkInAndCheckOut = (element, array, key) => {
    let allCheckBtn = element.querySelectorAll('.checkin-btn');

    allCheckBtn.forEach((btn, index) => {
        btn.onclick = () => {
            let tmp = key.split('_')[1];
            let data = array[index];
            array.splice(index, 1); // delete data from array
            localStorage.setItem(key, JSON.stringify(array));

            if (tmp == 'allBData') {
                allInHData.push(data);
                localStorage.setItem(user + "_allInHData", JSON.stringify(allInHData));
                ShowData(element, array, key);
            }
            else {
                allArchData.push(data);
                localStorage.setItem(user + "_allArchData", JSON.stringify(allArchData));
                ShowData(element, array, key);
            }
        }
    })
}

// show registration data
const ShowData = (element, array, key) => {
    element.innerHTML = "";
    array.forEach((item, index) => {
        element.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.location}</td>
                <td>${item.roomNo}</td>
                <td>${item.fullname}</td>
                <td>${item.checkInDate}</td>
                <td>${item.checkOutDate}</td>
                <td>${item.totalPeople}</td>
                <td>${item.mobile}</td>
                <td>${item.price}</td>
                <td>${item.notice}</td>
                <td>${formatDate(item.createdAt, true)}</td>
                <td>
                    <button class="btn btn-primary p-0 px-1 shadow-lg edit-btn">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn btn-info text-white p-0 px-1 shadow-lg checkin-btn">
                        <i class="fa fa-check"></i>
                    </button>
                    <button class="btn btn-danger p-0 px-1 shadow-lg del-btn">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr >
        `;
    });

    deleteDataFunc(element, array, key);
    updateDataFunc(element, array, key);
    checkInAndCheckOut(element, array, key);
}

// Log out coding
logoutBtn.onclick = () => {
    logoutBtn.innerHTML = "Please wait...";
    logoutBtn.disabled = true;

    setTimeout(() => {
        logoutBtn.innerHTML = "Logout";
        logoutBtn.disabled = false;
        sessionStorage.removeItem('__au__');
        window.location = '../../index.html';
    }, 3000);
}

// Booking coding
bookingForm.onsubmit = (e) => {
    e.preventDefault();
    registrationFunc(bTextarea, allBInput, allBData, `${user}_allBData`);
    bookingForm.reset();
    modalCBtn[0].click();
    ShowData(bListTBody, allBData, `${user}_allBData`);
}

// In house booking coding
inHouseForm.onsubmit = (e) => {
    e.preventDefault();
    registrationFunc(inHTextarea, allInHInput, allInHData, `${user}_allInHData`);
    inHouseForm.reset();
    modalCBtn[1].click();
    ShowData(inHListTBody, allInHData, `${user}_allInHData`);
}

ShowData(bListTBody, allBData, user + '_allBData');
ShowData(inHListTBody, allInHData, user + '_allInHData');