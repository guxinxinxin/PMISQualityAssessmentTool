$(document).ready(function () {
    const attributesData = [
        {
            category: "Reliability",
            description: "How well does the system maintain performance and recover from failures?",
            items: [
                { id: "robustness", name: "Robustness", question: "How well does the system handle unexpected situations or heavy loads without crashing?", weight: 6.61 },
                { id: "resilience", name: "Resilience", question: "How quickly and smoothly can the system recover from errors or interruptions?", weight: 5.95 },
                { id: "faultTolerance", name: "Fault Tolerance", question: "Can the system still work even if some parts fail?", weight: 5.95 }
            ]
        },
        {
            category: "Usability",
            description: "How easy and satisfying is it to use the system?",
            items: [
                { id: "learnability", name: "Learnability", question: "How easy is it for you to figure out how to use the system for the first time?", weight: 5.29 },
                { id: "satisfaction", name: "Satisfaction", question: "How happy are you with the overall experience of using the system?", weight: 5.53 },
                { id: "aestheticDesign", name: "Aesthetic Design", question: "How visually appealing and consistent is the system's design?", weight: 3.79 }
            ]
        },
        {
            category: "Functionality",
            description: "Does the system provide all necessary features and perform as expected?",
            items: [
                { id: "suitability", name: "Suitability", question: "Does the system do what you need it to do effectively?", weight: 6.9 },
                { id: "completeness", name: "Completeness", question: "Does the system have all the features you need?", weight: 4.78 },
                { id: "appropriateness", name: "Appropriateness", question: "Does the system work as you expect it to?", weight: 4.27 }
            ]
        },
        {
            category: "Interoperability",
            description: "How well does the system work with other tools and platforms?",
            items: [
                { id: "easeOfIntegration", name: "Ease of Integration", question: "How easily does the system work with other tools or software?", weight: 3.5 },
                { id: "compatibilityPerception", name: "Compatibility Perception", question: "Does the system work well on different devices or platforms?", weight: 3.23 },
                { id: "cooperation", name: "Cooperation", question: "How well does the system work with other tools or services?", weight: 3.31 }
            ]
        },
        {
            category: "Efficiency",
            description: "How well does the system perform with minimal resource usage and effort?",
            items: [
                { id: "perceivedSpeed", name: "Perceived Speed", question: "Does the system respond quickly and feel smooth to use?", weight: 4.88 },
                { id: "effortMinimization", name: "Effort Minimization", question: "Does the system make it easy for you to complete tasks without wasting time?", weight: 4.21 },
                { id: "optimizationAwareness", name: "Optimization Awareness", question: "Does the system use resources efficiently and optimize performance well?", weight: 3.32 }
            ]
        },
        {
            category: "Accuracy",
            description: "How correct and trustworthy are the system's operations and data?",
            items: [
                { id: "correctness", name: "Correctness", question: "Does the system do its job accurately without mistakes?", weight: 6.75 },
                { id: "precisionInContext", name: "Precision in Context", question: "Does the system provide accurate results in specific situations?", weight: 6.08 },
                { id: "trustworthiness", name: "Trustworthiness", question: "Do you feel safe using the system and trust it with your data?", weight: 6.47 },
            ]
        },
        {
            category: "Portability",
            description: "How easily can the system be adapted, deployed, and installed in different environments?",
            items: [
                { id: "easeOfAdaptation", name: "Ease of Adaptation", question: "How easily can the system adjust to changes or new situations?", weight: 2.81 },
                { id: "flexibilityOfDeployment", name: "Flexibility of Deployment", question: "Can the system be easily set up and used in different environments?", weight: 3.46 },
                { id: "installationSimplicity", name: "Installation Simplicity", question: "Is it easy to install the system without any hassle?", weight: 2.91 }
            ]
        }
    ];

    const attributesContainer = $('#attributesContainer');

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
            let radioButtonsHtml = '<div class="d-flex justify-content-between text-center radio-options-container mt-3">';
            ratingOptions.forEach(option => {
                radioButtonsHtml += `
                    <div class="radio-option-vertical-item">
                        <label class="radio-top-label d-block mb-1" for="${attr.id}-${option.value}">${option.label}</label>
                        <input class="form-check-input radio-button-actual d-block mx-auto gx-${option.value}" type="radio" name="${attr.id}" id="${attr.id}-${option.value}" value="${option.value}" required>
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

    // Add Chart.js CDN if not present
    if (!document.getElementById('chartjs-cdn')) {
        const script = document.createElement('script');
        script.id = 'chartjs-cdn';
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        document.head.appendChild(script);
    }

    let heptagonChartInstance = null;

    $('#assessmentForm').on('submit', function (event) {
        event.preventDefault();
        let totalWeightedScore = 0;
        const metricScores = [];
        const metricLabels = [];
        const metricAverages = [];
        let allRated = true;
        const subMetricScores = [];

        attributesData.forEach(group => {
            let groupSum = 0;
            let groupCount = 0;
            group.items.forEach(attr => {
                const value = $(`input[name="${attr.id}"]:checked`).val();
                if (value) {
                    groupSum += parseInt(value);
                    totalWeightedScore += parseInt(value) * attr.weight;
                    groupCount++;
                    subMetricScores.push({
                        category: group.category,
                        attribute: attr.name,
                        value: parseInt(value)
                    });
                } else {
                    allRated = false;
                }
            });
            // Average for this metric (category)
            const avg = groupCount > 0 ? groupSum / groupCount : 0;
            metricScores.push(avg);
            metricLabels.push(group.category);
            metricAverages.push({category: group.category, avg: avg});
        });

        if (!allRated) {
            alert("Please rate all attributes before submitting.");
            return;
        }

        totalWeightedScore *= 0.01;
        let qualityText = "";
        if (totalWeightedScore < 1.5) { qualityText = "Very Poor Quality"; }
        else if (totalWeightedScore < 2.5) { qualityText = "Poor Quality"; }
        else if (totalWeightedScore < 3.5) { qualityText = "Fair Quality"; }
        else if (totalWeightedScore < 4.5) { qualityText = "High Quality"; }
        else { qualityText = "Excellent Quality"; }

        // Store results in localStorage
        localStorage.setItem('pmis_result', JSON.stringify({
            totalWeightedScore,
            qualityText,
            metricAverages,
            subMetricScores
        }));
        window.location.href = 'result.html';
    });

    $('#assessmentForm').on('reset', function () {
        $('#attributesContainer input[type="radio"]').prop('checked', false);
    });
});