
AOS.init();

(function () {
    "use strict";
    
    const forms = document.querySelectorAll(".needs-validation");
    const result = document.getElementById("result");
    
    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener("submit", function (event) {
            let valid = true;
            
            const email = form.querySelector("#email");
            const phone = form.querySelector("#phone");
            
            // Email Validation
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(email.value)) {
                email.classList.add("is-invalid");
                valid = false;
            } else {
                email.classList.remove("is-invalid");
            }
            
            // Phone Number Validation (10 digits)
            const phonePattern = /^\d{10}$/;
            if (!phonePattern.test(phone.value)) {
                phone.classList.add("is-invalid");
                valid = false;
            } else {
                phone.classList.remove("is-invalid");
            }
            
            if (!form.checkValidity() || !valid) {
                event.preventDefault();
                event.stopPropagation();
                form.querySelectorAll(":invalid")[0].focus();
            } else {
                event.preventDefault();
                event.stopPropagation();

                const formData = new FormData(form);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);
                result.innerHTML = "Please wait...";

                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: json,
                })
                    .then(async (response) => {
                        let json = await response.json();
                        if (response.status == 200) {
                            result.innerHTML = json.message;
                            result.classList.remove("text-gray-500");
                            result.classList.add("text-green-500");
                        } else {
                            console.log(response);
                            result.innerHTML = json.message;
                            result.classList.remove("text-gray-500");
                            result.classList.add("text-red-500");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        result.innerHTML = "Something went wrong!";
                    })
                    .then(function () {
                        form.reset();
                        form.classList.remove("was-validated");
                        setTimeout(() => {
                            result.style.display = "none";
                        }, 5000);
                    });
            }
            form.classList.add("was-validated");
        }, false);
    });
})();
