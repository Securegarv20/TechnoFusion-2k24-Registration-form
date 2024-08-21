document.addEventListener('DOMContentLoaded', () => {
    // Function to show the pop-up
    // function showPopup() {
    //     Swal.fire({
    //         title: 'Info',
    //         html: `<p>The registration for Jain University Students will open from August 14th. Stay tuned!</p>
    //                <p style="font-size: 2em; font-weight: bold;" id="timer">Loading...</p>`,
    //         icon: 'info',
    //         background: '#1A1A1A',
    //         color: '#00FF00',
    //         showConfirmButton: false,
    //         didOpen: () => {
    //             const timerElement = Swal.getHtmlContainer().querySelector('#timer');
    //             const countdownDate = new Date('August 14, 2024 00:00:00').getTime();
    //             const updateTimer = () => {
    //                 const now = new Date().getTime();
    //                 const distance = countdownDate - now;

    //                 const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    //                 const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //                 const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    //                 const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    //                 timerElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    //                 if (distance < 0) {
    //                     clearInterval(popupInterval);
    //                     timerElement.textContent = "Registration is open!";
    //                 }
    //             };

    //             const popupInterval = setInterval(updateTimer, 1000);
    //             updateTimer(); // Call once to avoid delay in first display
    //         }
    //     });
    // }

    // Add event listener to the radio buttons
    const jainRadio = document.getElementById('jain');
    jainRadio.addEventListener('change', () => {
        if (jainRadio.checked) {
            showPopup();
        }
    });

    // Show/hide college name input based on participant type
    const participantTypeRadios = document.querySelectorAll('input[name="participant_type"]');
    const collegeNameBox = document.getElementById('college-name-box');

    participantTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (document.querySelector('input[name="participant_type"]:checked')?.value === 'Other') {
                collegeNameBox.classList.remove('hidden');
            } else {
                collegeNameBox.classList.add('hidden');
            }
        });
    });

    // Update price and team members when event changes
    const eventRadios = document.querySelectorAll('input[name="event"]');
    eventRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            updatePrice();
            updateTeamMembers();
        });
    });

    // Validate and navigate through steps
    document.querySelectorAll('.pay-button').forEach(button => {
        button.addEventListener('click', function(event) {
            if (button.textContent.includes('Next')) {
                if (validateCurrentStep()) {
                    const currentStep = document.querySelector('.step:not(.hidden)');
                    const nextStepMap = {
                        'step1': 2,
                        'step2': 3,
                        'step3': 4
                    };
                    const stepNumber = nextStepMap[currentStep.id] || null;

                    if (stepNumber) {
                        showStep(stepNumber);
                    } else {
                        document.getElementById('registrationForm').submit();
                    }
                } else {
                    event.preventDefault(); // Block the navigation if validation fails
                }
            }
        });
    });

    // Handle previous button navigation
    document.querySelectorAll('.previous-button').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = document.querySelector('.step:not(.hidden)');
            const prevStepMap = {
                'step2': 1,
                'step3': 2,
                'step4': 3
            };
            const stepNumber = prevStepMap[currentStep.id] || null;

            if (stepNumber) {
                showStep(stepNumber);
            }
        });
    });

    // Form submission with confirmation dialog
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from submitting immediately

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to submit the form?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, submit it!'
        }).then((result) => {
            if (result.isConfirmed) {
                form.submit(); // Submit the form programmatically
            }
        });
    });

    // Success page countdown and redirect
    const whatsappButton = document.getElementById('whatsapp-link');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior

            // Open WhatsApp link in a new tab
            window.open(this.href, '_blank');

            // Start the countdown
            startCountdown();
        });
    }

    function startCountdown() {
        const countdownElement = document.getElementById('countdown');
        const timerElement = document.getElementById('timer');
        let countdownValue = 3; // Start countdown from 3 seconds
        countdownElement.classList.remove('hidden'); // Show countdown

        // Update countdown every second
        const countdownInterval = setInterval(() => {
            timerElement.textContent = countdownValue;
            countdownValue -= 1;
            if (countdownValue < 0) {
                clearInterval(countdownInterval);
                window.location.href = 'https://jain.hosting.acm.org/technofusion-2024/'; // Redirect after countdown
            }
        }, 1000);
    }
});

// Step display logic
function showStep(stepNumber) {
    const steps = ['step1', 'step2', 'step3', 'step4'];
    steps.forEach((step, index) => {
        document.getElementById(step).classList.toggle('hidden', index + 1 !== stepNumber);
    });
}

// Form validation for the current step
function validateCurrentStep() {
    const currentStep = document.querySelector('.step:not(.hidden)');
    const inputs = currentStep.querySelectorAll("input[required]");
    let allFilled = true;

    inputs.forEach(input => {
        if (input.value.trim() === "") {
            allFilled = false;
            input.classList.add('input-error'); // Highlight the empty field
        } else {
            input.classList.remove('input-error'); // Remove highlight if filled
        }
    });

    if (!allFilled) {
        Swal.fire({
            title: 'Incomplete Information',
            text: "Please fill all required fields before proceeding.and use 'none' if you have less members.",
            icon: 'warning',
            confirmButtonText: 'OK'
        });
    }

    return allFilled;
}

// Update price based on participant type and event selection
function updatePrice() {
    const participantType = document.querySelector('input[name="participant_type"]:checked')?.value;
    const event = document.querySelector('input[name="event"]:checked')?.value;
    let price = 0;

    if (participantType && event) {
        const priceMap = {
            'Jain': {
                'BGMI': 199,
                'Valorant': 199,
                'Blazing-Tongue': 149,
                'IT-Quiz': 99,
                'Pixel-Perfect': 99,
                'Meme-Mania': 99,
                'CTF': 199,
                'Web-Wizards': 149,
                'Scam-Poetry': 149,
                'Jury-Rigged': 199,
                'Ideathon': 199
            },
            'Other': {
                'BGMI': 249,
                'Valorant': 249,
                'Blazing-Tongue': 199,
                'IT-Quiz': 149,
                'Pixel-Perfect': 149,
                'Meme-Mania': 149,
                'CTF': 249,
                'Web-Wizards': 199,
                'Scam-Poetry': 199,
                'Jury-Rigged': 249,
                'Ideathon': 249
            }
        };

        price = priceMap[participantType]?.[event] || "Event not found";
    } else {
        price = "Select or Enter Your College Name";
    }

    document.getElementById('price-display').textContent = price;
}

// Update team members input fields based on the selected event
function updateTeamMembers() {
    const selectedEvent = document.querySelector('input[name="event"]:checked');
    const teamGrid = document.getElementById('team-grid');
    teamGrid.innerHTML = '';

    if (selectedEvent) {
        let memberCount = 1;
        switch (selectedEvent.value) {
            case 'BGMI':
                memberCount = 4;
                break;
            case 'Valorant':
                memberCount = 5;
                break;
            case 'CTF':
                memberCount = 3;
                break;
            case 'Scam-Poetry':
                memberCount = 3;
                break;
            case 'IT-Quiz':
                memberCount = 1;
                break;
            case 'Jury-Rigged':
                memberCount = 2;
                break;
            case 'Web-Wizards':
                memberCount = 2;
                break;
            case 'Ideathon':
                memberCount = 3;
                break;
            case 'Blazing-Tongue':
                memberCount = 2;
                break;
            default:
                memberCount = 1;
                break;
        }

        for (let i = 0; i < memberCount; i++) {
            const div = document.createElement('div');
            div.classList.add('input_box', 'double');
            div.innerHTML = `
                <label for="member${i + 1}">Member ${i + 1} Name:</label>
                <input type="text" id="member${i + 1}" name="team_member_${i + 1}" placeholder="Enter member ${i + 1} name" required>
                ${selectedEvent.value === 'BGMI' ? `
                <div class="input_box bgmi-field">
                    <label for="player_${i + 1}_uid">Member ${i + 1} UID:</label>
                    <input type="text" id="player_${i + 1}uid" name="player${i + 1}_uid" placeholder="Enter Member ${i + 1}'s UID">
                </div>` : ''}
            `;
            teamGrid.appendChild(div);
        }
    }
}
