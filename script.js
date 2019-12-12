console.log("Hello Fome developers");
data = [{x: 10, y: 10}, {x: 100, y: 100},{x: 1000, y: 1000},{x: 10000, y: 10000},{x: 100000, y: 100000},{x: 0, y: 60000}];

var scatterChartData = {
    datasets: [{
        pointBorderWidth: 0,
        pointRadius: 5,
        data: data
    }]
};

function getEffectiveDensityState(m, T){
    return 2.51e19*Math.pow((m*T/(constatnt.m0*300.0)),1.5);
}

function getN(Nc, Eg, Ef, T){
    return Nc*Math.exp((Ef-Eg)/(constatnt.k*T));
}

function getP(Nv, Ef, T){
    return Nv*Math.exp((-Ef)/(constatnt.k*T));
}

function getNaMinus(Na0, Ea, Ef, T){
    return Na0/(1+Math.exp((Ea-Ef)/(constatnt.k*T)));
}

function getNdPlus(Nd0, Ed, Ef, T){
    return Nd0/(1+Math.exp((Ef-Ed)/(constatnt.k*T)));
}

function getConductivity(n, p, mue, mup){
    return constatnt.e*(n*mue+p*mup)*100;
}

function func(Ef,Nc, Nv, T, Na0, Nd0, Eg, Ea, Ed){
    let n = getN (Nc, Eg, Ef, T);
    let p = getP (Nv, Ef, T);
    let NdPlus = getNdPlus (T, Ed, Ef, Nd0);
    let NaMinus = getNaMinus (T, Ea, Ef, Na0);
    return NdPlus + p - n - NaMinus;
}

function getFermi(Nc, Nv, T, Na0, Nd0, Eg, Ea, Ed) {
    let left = 0;
    let right = 1e2;
    let middle = (left + right) / 2.0;
    let fm = func(middle,Nc,Nv,T,Na0,Nd0,Eg,Ea,Ed);
    let iters = 0;
    while (abs(fm) > 1 && iters < 1000) {
        let fleft = func(left,Nc,Nv,T,Na0,Nd0,Eg,Ea,Ed);
        let fright = func(right,Nc,Nv,T,Na0,Nd0,Eg,Ea,Ed);
        if (fleft * fm < 0) {
            right = middle;
        } else if (fright * fm < 0) {
            left = middle;
        } else {
            break;
        }
        middle = (left + right) / 2.0;
        fm = func(middle,Nc,Nv,T,Na0,Nd0,Eg,Ea,Ed);
        ++iters;
    }
    return middle;
}

function getMobility(a,  b, NdPlus, NaMinus, T){
    return a/(Math.pow(T,1.5)+b*(NdPlus+NaMinus)/Math.pow(T,1.5));
}

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