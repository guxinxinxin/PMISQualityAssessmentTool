$(document).ready(function () {
    const attributesData = [
        {
            category: "Reliability",
            description: "How well does the system maintain performance and recover from failures?",
            items: [
                { id: "robustness", name: "Robustness", question: "How well does the system handle unexpected situations or heavy loads without crashing?" },
                { id: "resilience", name: "Resilience", question: "How quickly and smoothly can the system recover from errors or interruptions?" },
                { id: "faultTolerance", name: "Fault Tolerance", question: "Can the system still work even if some parts fail?" }
            ]
        },
        {
            category: "Usability",
            description: "How easy and satisfying is it to use the system?",
            items: [
                { id: "learnability", name: "Learnability", question: "How easy is it for you to figure out how to use the system for the first time?" },
                { id: "satisfaction", name: "Satisfaction", question: "How happy are you with the overall experience of using the system?" },
                { id: "aestheticDesign", name: "Aesthetic Design", question: "How visually appealing and consistent is the system's design?" }
            ]
        },
        {
            category: "Functionality",
            description: "Does the system provide all necessary features and perform as expected?",
            items: [
                { id: "suitability", name: "Suitability", question: "Does the system do what you need it to do effectively?" },
                { id: "completeness", name: "Completeness", question: "Does the system have all the features you need?" },
                { id: "appropriateness", name: "Appropriateness", question: "Does the system work as you expect it to?" }
            ]
        },
        {
            category: "Interoperability",
            description: "How well does the system work with other tools and platforms?",
            items: [
                { id: "easeOfIntegration", name: "Ease of Integration", question: "How easily does the system work with other tools or software?" },
                { id: "compatibilityPerception", name: "Compatibility Perception", question: "Does the system work well on different devices or platforms?" },
                { id: "cooperation", name: "Cooperation", question: "How well does the system work with other tools or services?" }
            ]
        },
        {
            category: "Efficiency",
            description: "How well does the system perform with minimal resource usage and effort?",
            items: [
                { id: "perceivedSpeed", name: "Perceived Speed", question: "Does the system respond quickly and feel smooth to use?" },
                { id: "effortMinimization", name: "Effort Minimization", question: "Does the system make it easy for you to complete tasks without wasting time?" },
                { id: "optimizationAwareness", name: "Optimization Awareness", question: "Does the system use resources efficiently and optimize performance well?" }
            ]
        },
        {
            category: "Accuracy",
            description: "How correct and trustworthy are the system's operations and data?",
            items: [
                { id: "correctness", name: "Correctness", question: "Does the system do its job accurately without mistakes?" },
                { id: "precisionInContext", name: "Precision in Context", question: "Does the system provide accurate results in specific situations?" },
                { id: "trustworthiness", name: "Trustworthiness", question: "Do you feel safe using the system and trust it with your data?" }
            ]
        },
        {
            category: "Portability",
            description: "How easily can the system be adapted, deployed, and installed in different environments?",
            items: [
                { id: "easeOfAdaptation", name: "Ease of Adaptation", question: "How easily can the system adjust to changes or new situations?" },
                { id: "flexibilityOfDeployment", name: "Flexibility of Deployment", question: "Can the system be easily set up and used in different environments?" },
                { id: "installationSimplicity", name: "Installation Simplicity", question: "Is it easy to install the system without any hassle?" }
            ]
        }
    ];

    const attributesContainer = $('#attributesContainer');
    let totalAttributes = 0;

    const ratingOptions = [
        { value: 1, label: "Very Poor" },
        { value: 2, label: "Poor" },
        { value: 3, label: "Average" },
        { value: 4, label: "Good" },
        { value: 5, label: "Excellent" }
    ];

    attributesData.forEach(group => {
        const groupHtml = $(
        `<div class="attribute-category">
            <h3>${group.category}</h3>
            <p class="text-muted"><em>${group.description}</em></p>
        </div>`);
        
        const itemsContainer = $('<div></div>');

        group.items.forEach(attr => {
            totalAttributes++;
            let radioButtonsHtml = '<div class="d-flex justify-content-between text-center radio-options-container mt-3">';
            ratingOptions.forEach(option => {
                radioButtonsHtml += `
                    <div class="radio-option-vertical-item">
                        <label class="radio-top-label d-block mb-1" for="${attr.id}-${option.value}">${option.label}</label>
                        <input class="form-check-input radio-button-actual d-block mx-auto" type="radio" name="${attr.id}" id="${attr.id}-${option.value}" value="${option.value}" required>
                    </div>`;
            });
            radioButtonsHtml += '</div>';

            const attributeHtml = $(
            `<div class="form-group row">
                <label for="${attr.id}" class="col-sm-2 col-form-label"><strong>${attr.name}</strong></label>
                <div class="col-sm-7">
                    <div class="form-text text-muted d-block mb-2">${attr.question}</div>
                    ${radioButtonsHtml}
                </div>
            </div>`);
            itemsContainer.append(attributeHtml);
        });
        groupHtml.append(itemsContainer);
        attributesContainer.append(groupHtml);
    });

    $('#assessmentForm').on('submit', function (event) {
        event.preventDefault();
        let totalScore = 0;
        let ratedAttributes = 0;

        attributesData.forEach(group => {
            group.items.forEach(attr => {
                const value = $(`input[name="${attr.id}"]:checked`).val();
                if (value) {
                    totalScore += parseInt(value);
                    ratedAttributes++;
                }
            });
        });

        if (ratedAttributes < totalAttributes) {
            alert("Please rate all attributes before submitting.");
            return;
        }

        const averageScore = totalScore / totalAttributes;
        const percentageScore = (averageScore / 5) * 100;

        $('#scoreProgressBar').css('width', percentageScore + '%').attr('aria-valuenow', averageScore).text(averageScore.toFixed(2));
        
        const arrowPosition = ((averageScore - 1) / 4) * 100;
        $('#scoreArrow').css('left', arrowPosition + '%');

        let qualityText = "";
        let barClass = "";

        if (averageScore < 1.5) { qualityText = "Very Poor Quality"; barClass = "bg-danger"; }
        else if (averageScore < 2.5) { qualityText = "Poor Quality"; barClass = "bg-warning"; }
        else if (averageScore < 3.5) { qualityText = "Fair Quality"; barClass = "bg-info"; }
        else if (averageScore < 4.5) { qualityText = "High Quality"; barClass = "bg-primary"; }
        else { qualityText = "Excellent Quality"; barClass = "bg-success"; }

        $('#scoreQualityText').text(qualityText);
        $('#scoreProgressBar').removeClass('bg-danger bg-warning bg-info bg-primary bg-success').addClass(barClass);

        $('#scoreModal').modal('show');
    });

    $('#assessmentForm').on('reset', function () {
        $('#attributesContainer input[type="radio"]').prop('checked', false);
    });
});