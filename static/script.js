// $(document).ready(function () {

//     const video = document.getElementById('webcamVideo');

//     // Use navigator.mediaDevices.getUserMedia to access the webcam
//     navigator.mediaDevices.getUserMedia({
//         video: true
//     }).then(stream => {
//         video.srcObject = stream;
//     }).catch(error => {
//         console.error('Error accessing webcam:', error);
//     });

//     // Function to generate a random integer between min (inclusive) and max (inclusive)
//     function getRandomInt(min, max) {
//         return Math.floor(Math.random() * (max - min + 1)) + min;
//     }

//     // Function to generate a random float between min (inclusive) and max (exclusive)
//     function getRandomFloat(min, max) {
//         return (Math.random() * (max - min) + min).toFixed(1);
//     }

//     // Function to create the real-time line chart
//     var realTimeChart;
//     function createRealTimeChart() {
//         var ctx = document.getElementById('realTimeChart').getContext('2d');
//         var chart = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: [],
//                 datasets: [{
//                     label: 'Fatigue Level',
//                     borderColor: 'rgba(255, 99, 132, 1)',
//                     backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                     fill: false,
//                     data: []
//                 }, {
//                     label: 'Risk Score',
//                     borderColor: 'rgba(54, 162, 235, 1)',
//                     backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                     fill: false,
//                     data: []
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 scales: {
//                     x: {
//                         display: true,
//                         title: {
//                             display: true,
//                             text: 'Time'
//                         }
//                     },
//                     y: {
//                         display: true,
//                         title: {
//                             display: true,
//                             text: 'Value'
//                         }
//                     }
//                 }
//             }
//         });
//         return chart;
//     }

//     // Function to update the real-time line chart
//     function updateRealTimeChart(time, fatigueLevel, riskScore) {
//         if (!realTimeChart) {
//             realTimeChart = createRealTimeChart();
//         }

//         // Add data to datasets
//         realTimeChart.data.labels.push(time);
//         realTimeChart.data.datasets[0].data.push(fatigueLevel);
//         realTimeChart.data.datasets[1].data.push(riskScore);

//         // Limit the number of data points shown to keep the chart readable
//         var maxDataPoints = 20;
//         if (realTimeChart.data.labels.length > maxDataPoints) {
//             realTimeChart.data.labels.shift();
//             realTimeChart.data.datasets.forEach(function(dataset) {
//                 dataset.data.shift();
//             });
//         }

//         // Update chart
//         realTimeChart.update();
//     }

//     // Function to fetch prediction data from server
//     function fetchPrediction(data) {
//         $.ajax({
//             type: 'POST',
//             url: 'http://localhost:8080/predict',
//             contentType: 'application/json',
//             data: JSON.stringify(data),
//             success: function (response) {
//                 console.log('Response:', response);
//                 $('#fatigueLevel').text(response.fatigue_level);
//                 $('#riskScore').text(response.risk_score);
//                 displayRiskMessage(response.risk_score);

//                 // Update real-time chart with new data
//                 var time = new Date().toLocaleTimeString();
//                 updateRealTimeChart(time, response.fatigue_level, response.risk_score);
                
//                 // Check if high risk (risk score === 3) and update count
//                 if (response.risk_score === 3) {
//                     updateHighRiskCount(1); // Increment high-risk count
//                 }
//             },
//             error: function (error) {
//                 console.log('Error:', error);
//             }
//         });
//     }

//     // Function to display risk message based on risk score
//     function displayRiskMessage(riskScore) {
//         let riskMessageDiv = $('#riskMessage');
//         riskMessageDiv.empty();

//         if (riskScore === 3) {
//             riskMessageDiv.append('<div class="high-risk">High Risk</div>');
//         } else if (riskScore === 2) {
//             riskMessageDiv.append('<div class="medium-risk">Medium Risk</div>');
//         } else {
//             riskMessageDiv.append('<div class="low-risk">Low Risk</div>');
//         }
//     }

//     // Update data every 5 seconds (for simulation)
//     setInterval(function () {
//         const data = generateRandomData();
//         updateDashboard(data);
//         fetchPrediction(data);
//     }, 5000); // Update interval in milliseconds (e.g., every 5 seconds)

//     // Initial data update
//     updateDashboard(generateRandomData());
//     fetchPrediction(generateRandomData());

//     // Function to generate random data for simulation
//     function generateRandomData() {
//         return {
//             heart_rate: getRandomInt(60, 100),
//             body_temperature: getRandomFloat(36.0, 38.0),
//             screen_time: getRandomInt(50, 300),
//             activity_level: getRandomInt(1, 5),
//             self_reported_fatigue: getRandomInt(1, 5),
//             mood: getRandomInt(1, 5)
//         };
//     }

//     // Function to update the dashboard with new data
//     function updateDashboard(data) {
//         $('#heartRate').text(data.heart_rate);
//         $('#bodyTemperature').text(data.body_temperature);
//         $('#screenTime').text(data.screen_time);
//         $('#activityLevel').text(data.activity_level);
//         $('#selfReportedFatigue').text(data.self_reported_fatigue);
//         $('#mood').text(data.mood);
//     }

//     // Function to update high-risk count
//     function updateHighRiskCount(count) {
//         var highRiskCountElement = $('#highRiskCount');
//         var currentCount = parseInt(highRiskCountElement.text());
//         highRiskCountElement.text(currentCount + count);
//     }

// });

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

    // Static data array
   const staticDataArray = [
    { heart_rate: 69, body_temperature: 36.2, screen_time: 61, activity_level: 1, self_reported_fatigue: 1, mood: 1 },
    { heart_rate: 72, body_temperature: 36.8, screen_time: 65, activity_level: 4, self_reported_fatigue: 2, mood: 5 },
    { heart_rate: 79, body_temperature: 37.9, screen_time: 96, activity_level: 2, self_reported_fatigue: 1, mood: 5 },
    { heart_rate: 70, body_temperature: 32.5, screen_time: 170, activity_level: 4, self_reported_fatigue: 3, mood: 4 },
    { heart_rate: 82, body_temperature: 36.3, screen_time: 74, activity_level: 2, self_reported_fatigue: 3, mood: 1 },
    { heart_rate: 62, body_temperature: 37.1, screen_time: 74, activity_level: 2, self_reported_fatigue: 1, mood: 2 },
    { heart_rate: 70, body_temperature: 38.0, screen_time: 82, activity_level: 3, self_reported_fatigue: 1, mood: 1 },
    { heart_rate: 79, body_temperature: 37.4, screen_time: 82, activity_level: 4, self_reported_fatigue: 2, mood: 5 },
    { heart_rate: 83, body_temperature: 37.6, screen_time: 187, activity_level: 1, self_reported_fatigue: 2, mood: 1 },
    { heart_rate: 62, body_temperature: 36.4, screen_time: 147, activity_level: 3, self_reported_fatigue: 2, mood: 5 },
    { heart_rate: 79, body_temperature: 36.6, screen_time: 96, activity_level: 5, self_reported_fatigue: 2, mood: 5 },
    { heart_rate: 70, body_temperature: 36.7, screen_time: 86, activity_level: 2, self_reported_fatigue: 2, mood: 3 },
    { heart_rate: 64, body_temperature: 37.7, screen_time: 99, activity_level: 1, self_reported_fatigue: 1, mood: 3 },
    { heart_rate: 65, body_temperature: 36.1, screen_time: 54, activity_level: 3, self_reported_fatigue: 3, mood: 5 },
    { heart_rate: 61, body_temperature: 36.1, screen_time: 143, activity_level: 2, self_reported_fatigue: 3, mood: 1 },
    { heart_rate: 60, body_temperature: 37.7, screen_time: 262, activity_level: 1, self_reported_fatigue: 5, mood: 1 },
    { heart_rate: 92, body_temperature: 37.5, screen_time: 142, activity_level: 3, self_reported_fatigue: 5, mood: 1 },
    { heart_rate: 84, body_temperature: 37.4, screen_time: 107, activity_level: 2, self_reported_fatigue: 3, mood: 3 },
    { heart_rate: 83, body_temperature: 37.0, screen_time: 104, activity_level: 3, self_reported_fatigue: 3, mood: 2 },
    { heart_rate: 67, body_temperature: 36.7, screen_time: 61, activity_level: 3, self_reported_fatigue: 3, mood: 1 },
    { heart_rate: 74, body_temperature: 36.1, screen_time: 213, activity_level: 5, self_reported_fatigue: 1, mood: 1 },
    { heart_rate: 96, body_temperature: 37.3, screen_time: 230, activity_level: 1, self_reported_fatigue: 5, mood: 3 },
    { heart_rate: 97, body_temperature: 37.2, screen_time: 244, activity_level: 1, self_reported_fatigue: 2, mood: 2 },
    { heart_rate: 65, body_temperature: 36.2, screen_time: 116, activity_level: 4, self_reported_fatigue: 2, mood: 4 }
];


    let currentIndex = 0;

    // Function to get the next data from the static array
    function getNextData() {
        const data = staticDataArray[currentIndex];
        currentIndex = (currentIndex + 1) % staticDataArray.length;
        return data;
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
            url: 'http://18.207.123.225:8080//predict',
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
        const data = getNextData();
        updateDashboard(data);
        fetchPrediction(data);
    }, 5000); // Update interval in milliseconds (e.g., every 5 seconds)

    // Initial data update
    updateDashboard(getNextData());
    fetchPrediction(getNextData());

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
