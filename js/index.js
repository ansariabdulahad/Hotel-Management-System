// Global declarations
let allUserInfo = [];
let regForm = document.querySelector('.reg-form');
let allInput = regForm.querySelectorAll('INPUT');
let regBtn = regForm.querySelector('button');

// Get local information
if (localStorage.getItem('allUserInfo') != null) {
    allUserInfo = JSON.parse(localStorage.getItem('allUserInfo'));
}

// Signup registration form coding
regForm.onsubmit = (e) => {
    e.preventDefault();
    let data = {};
    let checkMobile = allUserInfo.find((data) => data.mobile == allInput[3].value);
    let checkEmail = allUserInfo.find((data) => data.email == allInput[4].value);

    if (allInput[0].value != "" && allInput[1].value != "" && allInput[2].value != "" &&
        allInput[3].value != "" && allInput[4].value != "" && allInput[5].value != "") {
        if (checkMobile === undefined) {
            if (checkEmail === undefined) {
                allInput[4].value;
                allInput[4].style.color = "inherit";
                for (let el of allInput) {
                    let key = el.name;
                    data[key] = el.value;
                }

                regBtn.innerHTML = "Processing...";
                regBtn.disabled = true;
                setTimeout(() => {
                    allUserInfo.push(data);
                    localStorage.setItem('allUserInfo', JSON.stringify(allUserInfo));
                    regForm.reset();
                    Swal.fire({
                        title: "Good job!",
                        text: "Registration completed successfully !",
                        icon: "success"
                    });
                    regBtn.innerHTML = "Register";
                    regBtn.disabled = false;
                }, 2000);
            } else {
                Swal.fire({
                    title: "Failed!",
                    text: `This email : ${allInput[4].value} already registered !`,
                    icon: "warning"
                });
                allInput[4].value = "Email already registered !";
                allInput[4].style.color = "red";
            }
        } else {
            Swal.fire({
                title: "Failed!",
                text: `This mobile : ${allInput[3].value} already registered !`,
                icon: "warning"
            });
            allInput[3].value = "Mobile already registered !";
            allInput[3].style.color = "red";
        }
    } else {
        Swal.fire({
            title: "Failed!",
            text: "All Fields are required !",
            icon: "warning"
        });
    }
}

// Login form coding
