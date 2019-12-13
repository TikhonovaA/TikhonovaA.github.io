console.log("Hello Fome developers");

//params - все константы
// select - выбор материала, value: Si, Ge, GaAs
// ed, ea, t_min, t_max, dt, 1_t, logscale
//nd - slider, nd_val - поле со значением слайдера
//nа - slider, nа_val - поле со значением слайдера

var T = [],
    downT = [],
    mue = [],
    muh = [],
    Nc = [],
    Nv = [],
    NdPlus = [],
    NaMinus = [],
    n = [],
    p = [],
    sigma = [],
    data = [];
var mode = "Electron mobility";

function changeMode(modeStr) {
    mode = modeStr;
    redraw();
}

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
    while (Math.abs(fm) > 1 && iters < 1000) {
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

//переключаем отображаемые данные
function redraw(){
    data.length = 0;
    let arr = [];
    if(mode == "Electron mobility") arr = mue;
    else if(mode == "Hole mobility") arr = muh;
    else if(mode == "Electron concentration") arr = n;
    else if(mode == "Hole concentration") arr = p;
    else if(mode == "Charged electron concentration") arr = NdPlus;
    else if(mode == "Charged hole concentration") arr = NaMinus;
    else if(mode == "Conductivity") arr = sigma;
    let count =0;
    for(let i = params.TMin; i<=params.TMax; i+=params.TCount){
        let point =({x: "", y: ""});
        point.x = i;
        point.y = arr[count];
        data.push(point);
        count++;
    }
    window.myScatter.data.datasets[0].data = data;
    window.myScatter.update();
}


window.onload = function() {

    fillArrays();

    let count =0;
    for(let i = params.TMin; i<=params.TMax; i+=params.TCount){
        let point =({x: "", y: ""});
        point.x = i;
        point.y = mue[count];
        data.push(point);
        count++;
    }

    var scatterChartData = {
        datasets: [{
            pointBorderWidth: 1,
            pointRadius: 3,
            data: data,
        }]
    };

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
                    },
                    scaleLabel:{
                        display:true,
                        labelString:"T",
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


//определяем действия после изменеия данных на клиенте
    document.getElementById('select').addEventListener('change', function () {
        let name = document.getElementById('select').value;
        let material;
        if(name == "Si") material = materials.Si;
        else if(name == "Ge") material = materials.Ge;
        else if(name == "GaAs") material = materials.GaAs;
        params.Eg = material.Eg;
        params.ae = material.ae;
        params.be = material.be;
        params.ah = material.ah;
        params.bh = material.bh;
        params.me = material.me;
        params.mh = material.mh;
        fillArrays();
        redraw()
    });

    document.getElementById('t_max').addEventListener('change', function () {
        params.TMax = document.getElementById('t_max').value;
        fillArrays();
        redraw()
    });

    document.getElementById('t_min').addEventListener('change', function () {
        params.TMin = document.getElementById('t_mim').value;
        fillArrays();
        redraw()
    });

    document.getElementById('dt').addEventListener('change', function () {
        params.TCount = document.getElementById('dt').value;
        fillArrays();
        redraw()
    });

    document.getElementById('ed').addEventListener('change', function () {
        params.Ed = document.getElementById('ed').value;
        fillArrays();
        redraw()
    });

    document.getElementById('ea').addEventListener('change', function () {
        params.Ea = document.getElementById('ea').value;
        fillArrays();
        redraw()
    });

    document.getElementById('nd_val').addEventListener('change', function () {
        params.Nd0 = document.getElementById('nd_val').value*Math.pow(10,15);
        fillArrays();
        redraw()
    });

    document.getElementById('nd').addEventListener('change', function () {
        params.Nd0 = document.getElementById('nd').value*Math.pow(10,15);
        fillArrays();
        redraw()
    });

    document.getElementById('na_val').addEventListener('change', function () {
        params.Na0 = document.getElementById('na_val').value*Math.pow(10,15);
        fillArrays();
        redraw()
    });

    document.getElementById('na').addEventListener('change', function () {
        params.Na0 = document.getElementById('na').value*Math.pow(10,15);
        fillArrays();
        redraw()
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


function fillArrays() {
    T.length =0;    downT.length = 0;   mue.length = 0;     muh.length = 0;
    Nc.length = 0;  Nv.length = 0;  NdPlus.length = 0;  NaMinus.length = 0;
    n.length = 0;   p.length = 0;   sigma.length = 0;
    let count = 0;
    for(let t = params.TMin; t<=params.TMax; t+=params.TCount){
        Nc.push(getEffectiveDensityState(params.me, t));
        Nv.push(getEffectiveDensityState(params.mh, t));
        let Ef = getFermi(Nc[count], Nv[count], t, params.Na0/Math.pow(10,15), params.Nd0/Math.pow(10,15), params.Eg, params.Ea, params.Ed);
        n.push(getN(Nc[count], params.Eg, Ef, t));
        p.push(getP(Nv[count], Ef, t));
        NdPlus.push(getNdPlus(Nc[count], params.Ed, Ef, t));
        NaMinus.push(getNaMinus(Nv[count], params.Ea, Ef,t));
        mue.push(getMobility(params.ae, params.be, params.Nd0, params.Na0, t));
        muh.push(getMobility(params.ah, params.bh, params.Nd0, params.Na0, t));
        sigma.push(getConductivity(n[count], p[count], mue[count],muh[count]));
        count++;
    }

}


};