$(function() {
    $("#header").load("/webapp/assets/header/header.html");
});

async function calcular() {
    try {
        let valorInicial = parseFloat(document.getElementById("valorInicial").value);
        let rendimento = parseFloat(document.getElementById("rendimento").value);
        let meses = parseInt(document.getElementById("meses").value);
        let valorFinal = valorInicial;

        let data = [];

        for (let i = 1; i <= meses; i++) {
            valorFinal = valorFinal * (1 + rendimento / 100);
            let a = {
                mes: i,
                valor: parseFloat(valorFinal.toFixed(2))
            };
            data.push(a);
        }

        document.getElementById("valorFinal").value = valorFinal.toFixed(2);

        await updateData(data);
        await fetchDataAndPopulateTable();
    } catch (error) {
        console.error("Error during calculation:", error);
    }
}

async function updateData(data) {
    try {
        let response = await fetch("https://api.jsonbin.io/v3/b/6532b95f54105e766fc4dfa9", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": "$2a$10$jyAfBTwo2U6.TwQfTEaUGebvDvlG8w0eBEect7I9cea8YAAK.Tzdy"
            },
            body: JSON.stringify({ data })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Data updated successfully");
    } catch (error) {
        console.error("Error updating data:", error);
    }
}

async function fetchDataAndPopulateTable() {
    try {
        let response = await fetch("https://api.jsonbin.io/v3/b/6532b95f54105e766fc4dfa9");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let db = await response.json();
        let data = db.record.data;

        let textoHTML = '';
        let chartLabels = [];
        let chartData = [];
        for (let i = 0; i < data.length; i++) {
            let a = data[i];
            textoHTML += `<tr><td>${a.mes}</td><td>${a.valor}</td></tr>`;
            chartLabels.push(a.mes);
            chartData.push(a.valor);
        }
        document.getElementById('tabelaValores').innerHTML = textoHTML;

        updateChartData(chartLabels, chartData);
        console.log("Table and chart updated successfully");
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function updateChartData(labels, data) {
    meugrafico.data.labels = labels;
    meugrafico.data.datasets[0].data = data;
    meugrafico.update();
}

document.getElementById("calcular").onclick = function() {
    limparTabela();
    calcular();
};

function limparTabela() {
    document.getElementById('tabelaValores').innerHTML = '';
}

var grafico = document.getElementById('grafico').getContext('2d');

var meugrafico = new Chart(grafico, {
    type: 'line',
    data: {
        labels: [], // Your labels array goes here
        datasets: [{
            label: 'Valor',
            data: [], // Your data array goes here
            backgroundColor: 'rgba(76, 175, 80, 0.2)', // Light green background
            borderColor: '#4CAF50', // Green border
            pointBackgroundColor: 'white', // White points
            pointBorderColor: '#4CAF50', // Green borders for the points
            pointHoverBackgroundColor: '#4CAF50', // Green point hover background
            pointHoverBorderColor: 'white' // White point hover border
        }]
    },
    options: {
        scales: {
            y: { // Updated for Chart.js 3.x
                beginAtZero: false,
                ticks: {
                    color: 'white' // White font color for the y-axis ticks
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.8)' // Make grid lines visible
                }
            },
            x: { // Updated for Chart.js 3.x
                ticks: {
                    color: 'white' // White font color for the x-axis ticks
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.8)' // Make grid lines visible
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white' // White font color for the legend labels
                }
            }
        },
        maintainAspectRatio: false // Add this to make the chart responsive
    }
});