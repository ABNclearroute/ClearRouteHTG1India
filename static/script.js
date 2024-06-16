
$(document).ready(function () {

    const video = document.getElementById('webcamVideo');

    // Use navigator.mediaDevices.getUserMedia to access the webcam
    navigator.mediaDevices.getUserMedia({
        video: true
    }).then(stream => {
        video.srcObject = stream;
    }).catch(error => {
        console.error('Error accessing webcam:', error);
    });

    // Function to generate a random integer between min (inclusive) and max (inclusive)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to generate a random float between min (inclusive) and max (exclusive)
    function getRandomFloat(min, max) {
        return (Math.random() * (max - min) + min).toFixed(1);
    }

    // Function to create the real-time line chart
    var realTimeChart;
    function createRealTimeChart() {
        var ctx = document.getElementById('realTimeChart').getContext('2d');
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Fatigue Level',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                    data: []
                }, {
                    label: 'Risk Score',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false,
                    data: []
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    }
                }
            }
        });
        return chart;
    }

    // Function to update the real-time line chart
    function updateRealTimeChart(time, fatigueLevel, riskScore) {
        if (!realTimeChart) {
            realTimeChart = createRealTimeChart();
        }

        // Add data to datasets
        realTimeChart.data.labels.push(time);
        realTimeChart.data.datasets[0].data.push(fatigueLevel);
        realTimeChart.data.datasets[1].data.push(riskScore);

        // Limit the number of data points shown to keep the chart readable
        var maxDataPoints = 20;
        if (realTimeChart.data.labels.length > maxDataPoints) {
            realTimeChart.data.labels.shift();
            realTimeChart.data.datasets.forEach(function(dataset) {
                dataset.data.shift();
            });
        }

        // Update chart
        realTimeChart.update();
    }

    // Function to fetch prediction data from server
    function fetchPrediction(data) {
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:8080/predict',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                console.log('Response:', response);
                $('#fatigueLevel').text(response.fatigue_level);
                $('#riskScore').text(response.risk_score);
                displayRiskMessage(response.risk_score);

                // Update real-time chart with new data
                var time = new Date().toLocaleTimeString();
                updateRealTimeChart(time, response.fatigue_level, response.risk_score);
                
                // Check if high risk (risk score === 3) and update count
                if (response.risk_score === 3) {
                    updateHighRiskCount(1); // Increment high-risk count
                }
            },
            error: function (error) {
                console.log('Error:', error);
            }
        });
    }

    // Function to display risk message based on risk score
    function displayRiskMessage(riskScore) {
        let riskMessageDiv = $('#riskMessage');
        riskMessageDiv.empty();

        if (riskScore === 3) {
            riskMessageDiv.append('<div class="high-risk">High Risk</div>');
        } else if (riskScore === 2) {
            riskMessageDiv.append('<div class="medium-risk">Medium Risk</div>');
        } else {
            riskMessageDiv.append('<div class="low-risk">Low Risk</div>');
        }
    }

    // Update data every 5 seconds (for simulation)
    setInterval(function () {
        const data = generateRandomData();
        updateDashboard(data);
        fetchPrediction(data);
    }, 5000); // Update interval in milliseconds (e.g., every 5 seconds)

    // Initial data update
    updateDashboard(generateRandomData());
    fetchPrediction(generateRandomData());

    // Function to generate random data for simulation
    function generateRandomData() {
        return {
            heart_rate: getRandomInt(60, 100),
            body_temperature: getRandomFloat(36.0, 38.0),
            screen_time: getRandomInt(50, 300),
            activity_level: getRandomInt(1, 5),
            self_reported_fatigue: getRandomInt(1, 5),
            mood: getRandomInt(1, 5)
        };
    }

    // Function to update the dashboard with new data
    function updateDashboard(data) {
        $('#heartRate').text(data.heart_rate);
        $('#bodyTemperature').text(data.body_temperature);
        $('#screenTime').text(data.screen_time);
        $('#activityLevel').text(data.activity_level);
        $('#selfReportedFatigue').text(data.self_reported_fatigue);
        $('#mood').text(data.mood);
    }

    // Function to update high-risk count
    function updateHighRiskCount(count) {
        var highRiskCountElement = $('#highRiskCount');
        var currentCount = parseInt(highRiskCountElement.text());
        highRiskCountElement.text(currentCount + count);
    }

});
