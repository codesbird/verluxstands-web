// ✅ Init EmailJS
(function () {
    emailjs.init("xZdDCXoMMAzN4GUtY"); // Replace with your EmailJS public key
})();

// Get elements for contactForm
const contact_form = document.getElementById("contactForm");
const spinner = document.getElementById("spinner");
const submit_icon = document.getElementById("submit_icon");
const submit_text = document.getElementById("submit_text");
const attachment_file = document.getElementById("file");

// Get brochure form
const brochure_form = document.getElementById("brochureForm");
const brochure_submit_btn = document.getElementById("brochure_submit_btn");
const brochure_message = document.getElementById("brochureFormMessage");

// ✅ Contact Form Submission Handler
contact_form.onsubmit = function (event) {
    event.preventDefault();

    toggleSpinner(true);

    const formData = new FormData(contact_form);
    const plainData = Object.fromEntries(formData.entries());
    plainData.timestemp = getDateTime();

    const validation = validateContactForm(plainData);

    if (validation.isValid) {
        sendContactEmail("service_wcyhwue", "template_jln20ul", contact_form)

    } else {
        displayFormErrors(validation.errors);
        toggleSpinner(false);
    }

};

function validateBrochureForm(data) {
    const errors = {};
    // Validate reCAPTCHA
    const recaptchaValue = brochure_form.querySelector('[name="g-recaptcha-response"]').value;
    if (!recaptchaValue) {
        errors.captcha = "Verify the google captch code"
        return {
            isValid: Object.keys(errors).length === 0,
            ...errors,
        };
    }

    if (!data.name || data.name.trim().length < 2) {
        errors.name = "Name is too short";
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Invalid email address";
    }
    if (!data.phone || data.phone.replace(/\D/g, "").length < 10) {
        errors.phone = "Phone must be at least 10 digits";
    }
    if (!data.company_name) errors.company_name = "Company name is required";

    return {
        isValid: Object.keys(errors).length === 0,
        ...errors,
    };
}

// ✅ Brochure Form Submission Handler
brochure_form.onsubmit = function (event) {
    event.preventDefault();

    brochure_submit_btn.disabled = true;
    brochure_submit_btn.innerText = "Submitting...";

    const formData = new FormData(brochure_form);
    const plainData = Object.fromEntries(formData.entries());
    plainData.timestemp = getDateTime();

    const validation = validateBrochureForm(plainData);
    if (!validation.isValid) {
        displayBrochureErrors(validation);
        return resetBrochureButton();
    }
    emailjs.sendForm('service_wcyhwue', 'template_y8kk1eo', brochure_form)
        .then(async () => {
            brochure_message.style.color = "green";
            brochure_message.innerText = "Form is submited success !.";
            brochure_message.classList.remove("hidden");

            setTimeout(() => {
                brochure_message.classList.add("hidden");
                brochure_message.innerText = "";
                brochure_form.reset();
                clearGoogleCaptcha(brochure_form)

                setTimeout(() => {
                    const modal = document.getElementById('downloadModal');
                    const brochureForm = document.getElementById('brochureForm');
                    brochureForm.classList.remove('active');
                    modal.classList.remove('active');

                }, 1000);
            }, 5000);
        })
        .catch((error) => {
            brochure_message.style.color = "red";
            brochure_message.innerText = "Failed to send message. Please try again.";
            brochure_message.classList.remove("hidden");
            setTimeout(() => {
                brochure_message.classList.add("hidden");
                brochure_message.innerText = "";
            }, 5000);
        })
        .finally(() => {
            resetBrochureButton();
            downloadBrochure();
        });

};

// ✅ Validation for Contact Form
function validateContactForm(data) {
    const errors = {};

    // Validate reCAPTCHA
    const recaptchaValue = document.querySelector('[name="g-recaptcha-response"]').value;

    if (!recaptchaValue) {
        errors.captcha = "Verify the google captch code"
        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    }

    if (!data.contact_name || data.contact_name.trim().length < 2) {
        errors.contact_name = "Contact name is too short";
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Invalid email address";
    }

    if (!data.phone || data.phone.replace(/\D/g, "").length < 10) {
        errors.phone = "Phone must be at least 10 digits";
    }

    if (!data.company_name) errors.company_name = "Company name is required";
    if (!data.exhibition_name) errors.exhibition_name = "Exhibition name is required";
    if (!data.event_city) errors.event_city = "Event city is required";
    if (!data.stand_dimension_area) errors.stand_dimension_area = "Stand dimension is required";
    if (!data.stand_budget) errors.stand_budget = "Stand budget is required";

    if (!data.message || data.message.trim().length < 10) {
        errors.message = "Message must be at least 10 characters";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

// ✅ Display field-specific error messages
function displayBrochureErrors(errors) {
    document.querySelectorAll(".brochure-message").forEach(el => { el.innerText = ""; el.classList.add("hidden") });

    console.log("error : ", errors)
    for (const field in errors) {
        const input = brochure_form.querySelector(`.message-${field}`);
        console.log("input : ", input)
        if (input) {
            input.innerText = errors[field];
            input.classList.remove("hidden");
            setTimeout(() => {
                input.innerText = "";
                input.classList.add("hidden");
            }, 3000);
        }
    }
}
// ✅ Display field-specific error messages
function displayFormErrors(errors) {
    document.querySelectorAll(".error-message").forEach(el => { el.innerText = ""; el.classList.add("hidden") });

    console.log("error : ", errors)
    for (const field in errors) {
        const input = contact_form.querySelector(`.message-${field}`);
        console.log("input : ", input)
        if (input) {
            input.innerText = errors[field];
            input.classList.remove("hidden");
            setTimeout(() => {
                input.innerText = "";
                input.classList.add("hidden");
            }, 3000);
        }
    }
}

// ✅ Send Email via EmailJS
function sendContactEmail(serviceID, templateID, contact_form) {
    // ✅ Send form with attachment
    emailjs.sendForm(serviceID, templateID, contact_form)
        .then(() => {
            showSuccess("formMessage", "Your message has been sent successfully.");
            contact_form.reset();
        })
        .catch((error) => {
            console.error("EmailJS error (contact form):", error);
            showError("formMessage", "Failed to send message. Please try again.");
        })
        .finally(() => { toggleSpinner(false); clearGoogleCaptcha(contact_form); });
}

// ✅ Utility to toggle spinner on contact form
function toggleSpinner(show) {
    if (show) {
        spinner.classList.remove("d-none");
        submit_icon.classList.add("d-none");
        submit_text.innerText = "Submitting...";
    } else {
        spinner.classList.add("d-none");
        submit_icon.classList.remove("d-none");
        submit_text.innerText = "Submit";
    }
}

// ✅ Utility: Reset brochure form button
function resetBrochureButton() {
    brochure_submit_btn.disabled = false;
    brochure_submit_btn.innerText = "Claim Your Brochure";
}

// ✅ Utility: Show success messages
function showSuccess(targetId, message) {
    const el = document.getElementById(targetId);
    if (el) {
        el.style.color = "green";
        el.innerText = message;
    }
}

// ✅ Utility: Show error messages
function showError(targetId, message) {
    const el = document.getElementById(targetId);
    if (el) {
        el.style.color = "red";
        el.innerText = message;
    }
}

function clearGoogleCaptcha(form) {
    // Find the reCAPTCHA widget inside the given form and reset it
    // Find the captcha element inside the form
    try {
        const captchaElem = form.querySelector('.g-recaptcha');
        if (captchaElem && captchaElem.getAttribute('data-widget-id')) {
            // If you manually rendered the captcha, use its widget ID
            grecaptcha.reset(captchaElem.getAttribute('data-widget-id'));
        } else {
            // If you use automatic rendering, fallback to reset all
            grecaptcha.reset();
        }
    }
    catch (error) {
        console.error("Error resetting reCAPTCHA:", error);
    }
}

async function downloadBrochure() {
    // Disable button and show downloading state
    brochure_submit_btn.disabled = true;
    brochure_submit_btn.innerText = "Bruchure Downloading...";

    // Simulate a delay for downloading
    setTimeout(() => {
        const brochureUrl = './assets/Verlux_Stands_brochure.pdf';

        // Create a temporary anchor element to trigger download
        let a = document.createElement('a');
        a.href = brochureUrl;
        a.download = 'Verlux_Stands_brochure.pdf';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Re-enable button and reset text
        brochure_submit_btn.innerText = "Claim Your Brochure";
        brochure_submit_btn.disabled = false;

    }, 5000);
}

// ✅ Get formatted date time
function getDateTime() {
    const now = new Date();
    return `${now.toLocaleDateString()} @ ${now.toLocaleTimeString()}`;
}
