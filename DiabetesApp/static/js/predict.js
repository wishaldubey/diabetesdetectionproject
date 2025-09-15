// Form validation and interaction handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('healthForm');
    const inputs = form.querySelectorAll('.form-input');
    const submitBtn = document.getElementById('submitBtn');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    // Validation rules for each field
    const validationRules = {
        Age: {
            min: 1,
            max: 120,
            message: 'Age must be between 1 and 120 years'
        },
        Glucose: {
            min: 0,
            max: 300,
            message: 'Glucose level must be between 0 and 300 mg/dL'
        },
        BloodPressure: {
            min: 40,
            max: 140,
            message: 'Blood pressure must be between 40 and 140 mmHg'
        },
        Insulin: {
            min: 0,
            max: 1000,
            message: 'Insulin level must be between 0 and 1000 mu U/ml'
        },
        BMI: {
            min: 10,
            max: 70,
            message: 'BMI must be between 10 and 70'
        },
        SkinThickness: {
            min: 0,
            max: 100,
            message: 'Skin thickness must be between 0 and 100 mm'
        },
        DiabetesPedigreeFunction: {
            min: 0,
            max: 3,
            message: 'Diabetes pedigree function must be between 0 and 3'
        }
    };

    // Initialize form
    initializeForm();

    function initializeForm() {
        // Add event listeners to all inputs
        inputs.forEach(input => {
            input.addEventListener('input', handleInputChange);
            input.addEventListener('blur', validateField);
            input.addEventListener('focus', clearFieldError);
        });

        // Add form submit handler
        form.addEventListener('submit', handleFormSubmit);

        // Update progress on page load
        updateProgress();

        // Add animation classes
        document.querySelector('.form-main').classList.add('slide-up');
        document.querySelector('.form-sidebar').classList.add('fade-in');
    }

    function handleInputChange(e) {
        const input = e.target;
        const inputGroup = input.closest('.input-group');
        
        // Real-time validation
        if (input.value) {
            validateField(e);
        } else {
            clearFieldError(e);
        }
        
        // Update progress
        updateProgress();
        
        // Add visual feedback
        if (input.value && isFieldValid(input)) {
            inputGroup.classList.add('success');
            inputGroup.classList.remove('error');
        } else if (input.value) {
            inputGroup.classList.add('error');
            inputGroup.classList.remove('success');
        } else {
            inputGroup.classList.remove('success', 'error');
        }
    }

    function validateField(e) {
        const input = e.target;
        const fieldName = input.name;
        const value = parseFloat(input.value);
        const rules = validationRules[fieldName];
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (!input.value) {
            showFieldError(input, 'This field is required');
            return false;
        }
        
        if (isNaN(value)) {
            showFieldError(input, 'Please enter a valid number');
            return false;
        }
        
        if (rules && (value < rules.min || value > rules.max)) {
            showFieldError(input, rules.message);
            return false;
        }
        
        // Additional specific validations
        if (fieldName === 'BMI' && (value < 10 || value > 70)) {
            showFieldError(input, 'BMI seems unusually high or low. Please check your calculation.');
            return false;
        }
        
        if (fieldName === 'Glucose' && value > 200) {
            showFieldWarning(input, 'High glucose level detected. Please consult a healthcare provider.');
        }
        
        clearFieldError(e);
        return true;
    }

    function showFieldError(input, message) {
        const inputGroup = input.closest('.input-group');
        const errorElement = inputGroup.querySelector('.error-message');
        
        errorElement.textContent = message;
        errorElement.classList.add('show');
        inputGroup.classList.add('error');
        inputGroup.classList.remove('success');
    }

    function showFieldWarning(input, message) {
        const inputGroup = input.closest('.input-group');
        const helpElement = inputGroup.querySelector('.input-help');
        
        helpElement.style.color = 'var(--warning-color)';
        helpElement.innerHTML = `⚠ ${message}`;
    }

    function clearFieldError(e) {
        const input = e.target;
        const inputGroup = input.closest('.input-group');
        const errorElement = inputGroup.querySelector('.error-message');
        const helpElement = inputGroup.querySelector('.input-help');
        
        errorElement.classList.remove('show');
        inputGroup.classList.remove('error');
        
        // Reset help text color
        helpElement.style.color = '';
        
        // Restore original help text
        const originalHelp = {
            'Age': 'Typical range: 21-81 years',
            'Glucose': 'Normal: 70-99 mg/dL (fasting)',
            'BloodPressure': 'Normal: 60-80 mmHg (diastolic)',
            'Insulin': 'Normal: 2.6-24.9 mu U/ml',
            'BMI': 'Normal: 18.5-24.9 BMI',
            'SkinThickness': 'Typical range: 7-47 mm',
            'DiabetesPedigreeFunction': 'Range: 0.078-2.42 (family history)'
        };
        
        if (originalHelp[input.name]) {
            helpElement.textContent = originalHelp[input.name];
        }
    }

    function isFieldValid(input) {
        const fieldName = input.name;
        const value = parseFloat(input.value);
        const rules = validationRules[fieldName];
        
        if (!input.value || isNaN(value)) return false;
        if (rules && (value < rules.min || value > rules.max)) return false;
        
        return true;
    }

    function updateProgress() {
        const totalFields = inputs.length;
        const filledFields = Array.from(inputs).filter(input => 
            input.value && isFieldValid(input)
        ).length;
        
        const percentage = Math.round((filledFields / totalFields) * 100);
        
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% Complete`;
        
        // Update submit button state
        if (percentage === 100) {
            submitBtn.disabled = false;
            submitBtn.classList.add('ready');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.remove('ready');
        }
        
        // Mark sections as completed
        updateSectionCompletion();
    }

    function updateSectionCompletion() {
        const sections = document.querySelectorAll('.form-section');
        
        sections.forEach(section => {
            const sectionInputs = section.querySelectorAll('.form-input');
            const completedInputs = Array.from(sectionInputs).filter(input => 
                input.value && isFieldValid(input)
            );
            
            if (completedInputs.length === sectionInputs.length) {
                section.classList.add('completed');
            } else {
                section.classList.remove('completed');
            }
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            showFormError('Please correct the errors above before submitting.');
            return;
        }
        
        // Show loading state
        showLoadingState();
        
        // Submit form
        setTimeout(() => {
            form.submit();
        }, 500);
    }

    function showLoadingState() {
        const submitBtnText = submitBtn.querySelector('span');
        const loadingSpinner = submitBtn.querySelector('.loading-spinner');
        
        submitBtn.disabled = true;
        submitBtnText.style.display = 'none';
        loadingSpinner.style.display = 'block';
        
        // Add loading class to form
        form.classList.add('form-loading');
        
        // Show progress as 100%
        progressFill.style.width = '100%';
        progressText.textContent = 'Processing...';
    }

    function showFormError(message) {
        // Create or update form error message
        let errorDiv = document.querySelector('.form-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.cssText = `
                background: #fef2f2;
                border: 1px solid #fecaca;
                color: #dc2626;
                padding: 1rem;
                border-radius: 0.5rem;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            `;
            form.insertBefore(errorDiv, form.firstChild);
        }
        
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // BMI Calculator helper
    function addBMICalculator() {
        const bmiInput = document.getElementById('BMI');
        const bmiGroup = bmiInput.closest('.input-group');
        
        // Add BMI calculator button
        const calculatorBtn = document.createElement('button');
        calculatorBtn.type = 'button';
        calculatorBtn.className = 'bmi-calculator-btn';
        calculatorBtn.innerHTML = '<i class="fas fa-calculator"></i> Calculate BMI';
        calculatorBtn.style.cssText = `
            margin-top: 0.5rem;
            padding: 0.5rem 1rem;
            background: var(--secondary-color);
            color: white;
            border: none;
            border-radius: 0.25rem;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        calculatorBtn.addEventListener('click', showBMICalculator);
        bmiGroup.appendChild(calculatorBtn);
    }

    function showBMICalculator() {
        // Create modal for BMI calculation
        const modal = document.createElement('div');
        modal.className = 'bmi-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-calculator"></i> BMI Calculator</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="input-group">
                        <label>Height (cm)</label>
                        <input type="number" id="height" placeholder="Enter height in cm" min="100" max="250" class="modal-input">
                    </div>
                    <div class="input-group">
                        <label>Weight (kg)</label>
                        <input type="number" id="weight" placeholder="Enter weight in kg" min="30" max="300" step="0.1" class="modal-input">
                    </div>
                    <button type="button" class="btn-primary calc-btn" onclick="calculateBMI()">Calculate BMI</button>
                    <div class="bmi-result" style="display: none;"></div>
                </div>
            </div>
        `;
        
        // Add comprehensive modal styles
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .bmi-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                backdrop-filter: blur(5px);
            }
            
            .bmi-modal .modal-content {
                background: white;
                border-radius: 1rem;
                box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .bmi-modal .modal-header {
                padding: 1.5rem 2rem;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #f8fafc;
                border-radius: 1rem 1rem 0 0;
            }
            
            .bmi-modal .modal-header h3 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
                color: #1f2937;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .bmi-modal .modal-header i {
                color: #2563eb;
            }
            
            .bmi-modal .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
                padding: 0.25rem;
                border-radius: 0.25rem;
                transition: all 0.3s ease;
            }
            
            .bmi-modal .modal-close:hover {
                background: #f3f4f6;
                color: #1f2937;
            }
            
            .bmi-modal .modal-body {
                padding: 2rem;
            }
            
            .bmi-modal .input-group {
                margin-bottom: 1.5rem;
            }
            
            .bmi-modal .input-group label {
                display: block;
                font-weight: 500;
                color: #374151;
                margin-bottom: 0.5rem;
                font-size: 0.95rem;
            }
            
            .bmi-modal .modal-input {
                width: 100%;
                padding: 0.875rem 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 0.5rem;
                font-size: 1rem;
                transition: all 0.3s ease;
                outline: none;
            }
            
            .bmi-modal .modal-input:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            .bmi-modal .calc-btn {
                width: 100%;
                margin-bottom: 1rem;
                justify-content: center;
            }
            
            .bmi-modal .bmi-result {
                margin-top: 1rem;
            }
        `;
        document.head.appendChild(modalStyles);
        
        document.body.appendChild(modal);
        
        // Close modal handlers
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(modalStyles);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.head.removeChild(modalStyles);
            }
        });
        
        // Focus first input
        setTimeout(() => {
            modal.querySelector('#height').focus();
        }, 100);
    }

    // Add BMI calculator
    addBMICalculator();

    // Smooth scrolling for form sections
    function addSectionNavigation() {
        const sections = document.querySelectorAll('.form-section h2');
        sections.forEach((section, index) => {
            section.style.cursor = 'pointer';
            section.addEventListener('click', () => {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    addSectionNavigation();

    // Auto-save form data to localStorage
    function autoSaveForm() {
        const formData = {};
        inputs.forEach(input => {
            if (input.value) {
                formData[input.name] = input.value;
            }
        });
        localStorage.setItem('diabetesFormData', JSON.stringify(formData));
    }

    // Restore form data from localStorage
    function restoreFormData() {
        const savedData = localStorage.getItem('diabetesFormData');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                Object.keys(formData).forEach(key => {
                    const input = document.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = formData[key];
                        handleInputChange({ target: input });
                    }
                });
            } catch (e) {
                console.log('Could not restore form data');
            }
        }
    }

    // Auto-save on input change
    inputs.forEach(input => {
        input.addEventListener('input', autoSaveForm);
    });

    // Restore data on page load
    restoreFormData();

    // Clear saved data on successful submission
    form.addEventListener('submit', () => {
        localStorage.removeItem('diabetesFormData');
    });
});

// Global function for BMI calculation (called from modal)
function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const resultDiv = document.querySelector('.bmi-result');
    
    if (!height || !weight) {
        resultDiv.innerHTML = '<p style="color: var(--error-color);">Please enter both height and weight.</p>';
        resultDiv.style.display = 'block';
        return;
    }
    
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    let category = '';
    let color = '';
    
    if (bmi < 18.5) {
        category = 'Underweight';
        color = 'var(--warning-color)';
    } else if (bmi < 25) {
        category = 'Normal weight';
        color = 'var(--success-color)';
    } else if (bmi < 30) {
        category = 'Overweight';
        color = 'var(--warning-color)';
    } else {
        category = 'Obese';
        color = 'var(--error-color)';
    }
    
    resultDiv.innerHTML = `
        <div style="text-align: center; padding: 1rem; background: var(--bg-secondary); border-radius: 0.5rem; margin-top: 1rem;">
            <h4>Your BMI: <span style="color: ${color}; font-size: 1.5rem;">${bmi}</span></h4>
            <p style="color: ${color}; font-weight: 600;">${category}</p>
            <button type="button" class="btn-primary" onclick="useBMI(${bmi})" style="margin-top: 1rem;">
                Use This BMI
            </button>
        </div>
    `;
    resultDiv.style.display = 'block';
}

// Function to use calculated BMI
function useBMI(bmi) {
    const bmiInput = document.getElementById('BMI');
    bmiInput.value = bmi;
    bmiInput.dispatchEvent(new Event('input'));
    
    // Close modal
    const modal = document.querySelector('.bmi-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const submitBtn = document.getElementById('submitBtn');
        if (!submitBtn.disabled) {
            submitBtn.click();
        }
    }
    
    // Escape to clear current input
    if (e.key === 'Escape' && document.activeElement.classList.contains('form-input')) {
        document.activeElement.value = '';
        document.activeElement.dispatchEvent(new Event('input'));
    }
});

// Add tooltips for better UX
function addTooltips() {
    const tooltipData = {
        'DiabetesPedigreeFunction': 'This represents your genetic predisposition to diabetes based on family history. Higher values indicate stronger family history of diabetes.',
        'SkinThickness': 'Measured at the triceps using calipers. This helps assess body fat distribution.',
        'Insulin': 'Fasting insulin levels help assess how well your body processes glucose.'
    };
    
    Object.keys(tooltipData).forEach(fieldName => {
        const input = document.querySelector(`[name="${fieldName}"]`);
        if (input) {
            const label = input.closest('.input-group').querySelector('label');
            label.title = tooltipData[fieldName];
            label.style.cursor = 'help';
        }
    });
}
