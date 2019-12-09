console.log("Hello Fome developers");
data = [{x: 10, y: 10}, {x: 100, y: 100},{x: 1000, y: 1000},{x: 10000, y: 10000},{x: 100000, y: 100000}];

var scatterChartData = {
    datasets: [{
        pointBorderWidth: 0,
        pointRadius: 5,
        data: data
    }]
};

window.onload = function() {
    var ctx = document.getElementById('myChart');
    ctx.canvas.height = 500;
    ctx.canvas.width = 500;
    window.myScatter = new Chart(ctx, {
        type: 'line',
        data: scatterChartData,
        options: {
            scales: {
                xAxes:[{
                    type: "logarithmic",
                    ticks: {
                        min: 0,
                    }
                }],
            }
        },
    });
}