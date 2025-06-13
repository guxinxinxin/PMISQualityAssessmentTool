$(document).ready(function () {
    const result = JSON.parse(localStorage.getItem('pmis_result'));
    if (!result) {
        window.location.href = 'index.html';
        return;
    }
    // Score bar and quality text
    const totalWeightedScore = result.totalWeightedScore;
    const qualityText = result.qualityText;
    const percentageScore = ((totalWeightedScore) / 5) * 100;
    $('#scoreQualityText').text(qualityText);
    let barClass = '';
    if (totalWeightedScore < 1.5) { barClass = 'bg-danger'; }
    else if (totalWeightedScore < 2.5) { barClass = 'bg-warning'; }
    else if (totalWeightedScore < 3.5) { barClass = 'bg-info'; }
    else if (totalWeightedScore < 4.5) { barClass = 'bg-primary'; }
    else { barClass = 'bg-success'; }
    $('#scoreProgressBar').css('width', percentageScore + '%').attr('aria-valuenow', totalWeightedScore).text(totalWeightedScore.toFixed(2));
    $('#scoreProgressBar').removeClass('bg-danger bg-warning bg-info bg-primary bg-success').addClass(barClass);
    $('#scoreArrow').css('left', percentageScore + '%');
    // Conclusion
    // (Reuse the same logic as in script.js for conclusion)
    let conclusionText = `This assessment indicates the system's overall quality is <b>${qualityText}</b>, with total score of <b>${totalWeightedScore.toFixed(2)}</b> out of 5.<br><br>`;
    let highMetricsList = [];
    let lowMetricsList = [];
    let averageMetricsList = [];
    result.metricAverages.forEach(m => {
        if (m.avg >= 4) {
            highMetricsList.push(m.category);
        } else if (m.avg < 3) {
            lowMetricsList.push(m.category);
        } else {
            averageMetricsList.push(m.category);
        }
    });
    if (highMetricsList.length > 0) {
        if (highMetricsList.length === result.metricAverages.length) {
            conclusionText += `<p>The system performs well. Keep maintaining the high standard in all areas.</p>`;
        } else {
            conclusionText += `<p>Excellent performance area, keep maintaining this high standard in this area: <b>${highMetricsList.join(', ')}</b>.</p>`;
        }
    }
    if (lowMetricsList.length > 0) {
        if (lowMetricsList.length === result.metricAverages.length) {
            conclusionText += `<p>The system performs poorly. Consider prioritizing improvements in all areas to enhance overall system quality.</p>`;
        } else {
            conclusionText += `<p>Low performance area, consider prioritizing improvements in this area to enhance overall system quality: <b>${lowMetricsList.join(', ')}</b>.</p>`;
        }
    }
    if (averageMetricsList.length > 0) {
        if (averageMetricsList.length === result.metricAverages.length) {
            conclusionText += `<p>The system performs average. There is room for further improvement in all areas.</p>`;
        } else {
            conclusionText += `<p>Satisfactory performance area, there is room for further improvement: <b>${averageMetricsList.join(', ')}</b>.</p>`;
        }
    }
    $('#conclusionText').html(conclusionText);
    // Previous Page button
    $('#prevPageBtn').on('click', function () {
        window.location.href = 'index.html';
    });
    // --- Custom Table Visualization ---
    // Group sub-metrics by category
    const grouped = {};
    result.subMetricScores.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
    });
    // Build table HTML
    let tableHtml = '<table class="table table-borderless mb-4">';
    tableHtml += '<thead><tr><th>Quality Metric</th><th>Attribute</th><th>Score (out of 5)</th></tr></thead><tbody>';
    result.metricAverages.forEach((metric, i) => {
        // Metric group row with dynamic dot color
        const dotClass = getBarClass(metric.avg);
        tableHtml += `<tr class="metric-group"><td><span class="metric-dot ${dotClass}"></span><b>${metric.category}</b></td><td></td><td></td></tr>`;
        // Sub-metrics
        (grouped[metric.category] || []).forEach(sub => {
            tableHtml += `<tr><td></td><td>${sub.attribute}</td><td>${renderScoreBar(sub.value)}</td></tr>`;
        });
        // Average row
        tableHtml += `<tr class="metric-average"><td></td><td><span class="font-weight-bold">${metric.category} Average</span></td><td>${renderScoreBar(metric.avg, true)}</td></tr>`;
    });
    tableHtml += '</tbody></table>';
    $('#scoreTableContainer').html(tableHtml);

    function renderScoreBar(score, isAvg) {
        let html = '<span class="score-bar">';
        const colorClass = getBarClass(score);
        for (let i = 1; i <= 5; i++) {
            html += `<span class="score-segment${i <= Math.round(score) ? ' filled ' + colorClass : ''}"></span>`;
        }
        html += '</span>';
        html += `<span class="ml-1">(${score.toFixed(1)})</span>`;
        return html;
    }

    function getBarClass(score) {
        if (score < 1.5) return 'bg-danger';
        if (score < 2.5) return 'bg-warning';
        if (score < 3.5) return 'bg-info';
        if (score < 4.5) return 'bg-primary';
        return 'bg-success';
    }
}); 