console.log("Hello Fome developers");
data = [{x: 10, y: 10}, {x: 100, y: 100},{x: 1000, y: 1000},{x: 10000, y: 10000},{x: 100000, y: 100000},{x: 0, y: 60000}];

var scatterChartData = {
    datasets: [{
        pointBorderWidth: 0,
        pointRadius: 5,
        data: data
    }]
};

window.onload = function() {
    var ctx = document.getElementById('myChart').getContext('2d');
    ctx.canvas.height = 600;
    ctx.canvas.width = 600;
    window.myScatter = new Chart(ctx, {
        type: 'line',
        data: scatterChartData,
        options: {
            scales: {
                xAxes:[{
                    type: "linear",
                    ticks: {
                        min: 0,
                    }
                }],
                yAxes:[{
                    type: "linear",
                    ticks: {
                        min: 0,
                        //приводим числа на оси к виду 10^n
                        callback: function(value) {
                            if (document.getElementById('logscale').value == 1) {
                                if((value === 0) || (value === 1) || (value === 10) || (value === 100)) return value;
                                else if (value%10 === 0) {
                                    if(Math.log10(Number(value)) == Math.log10(Number(value)).toPrecision(1))
                                        return  "10^" + Math.log10(Number(value)).toString();
                                }
                                else return "";
                            }
                            else return value;
                        },
                    }
                }],
            }
        },
    });


//set logscale y
document.getElementById('logscale').addEventListener('click', function () {
    let element = document.getElementById('logscale');
    if(element.value == 0) {
        window.myScatter.options.scales.yAxes[0].type = 'logarithmic';
        element.value = 1;
        window.myScatter.update();
    }
    else {
        window.myScatter.options.scales.yAxes[0].type = 'linear';
        element.value = 0;
        window.myScatter.update();
    }
});





};