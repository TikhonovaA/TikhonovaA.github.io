//params - здесь устанавливаются значения, установленные пользователем
var params = {
    "Ed": 0.1,
    "Nd0": 10*Math.pow(10,15),
    "Ea": 0.1,
    "Na0": Math.pow(10,15),
    "me": 9.11*Math.pow(10,-28),
    "mh": 4.5*Math.pow(10,-28),
    "Eg": 1.12,
    "TCount":10,
    "TMax":1000,
    "TMin":200,
    "ae":5.23615*Math.pow(10,6),
    "be":3.12909*Math.pow(10,-12),
    "ah":2.49422*Math.pow(10,6),
    "bh":2.22082*Math.pow(10,-12)
};

//константы
var constatnt = {
    "k":8.617*Math.pow(10,-5),
    "e":1.6*Math.pow(10,-19),
    "m0":9.11*Math.pow(10, -28)
};

//материалы и их параметры
var materials = {
     "Si": {
        "Eg": 1.12,
        "ae": 5.23615 * Math.pow(10, 6),
        "be": 3.12909 * Math.pow(10, -12),
        "ah": 2.49422 * Math.pow(10, 6),
        "bh": 2.22082 * Math.pow(10, -12),
        "me": constatnt.m0 * 1.08,
        "mh": constatnt.m0 * 0.56,
    },
    "Ge": {
        "Eg": 0.65,
        "ae": 1.86969 * Math.pow(10, 7),
        "be": 3.05712 * Math.pow(10, -11),
        "ah": 8.02447 * Math.pow(10, 6),
        "bh": 2.13096 * Math.pow(10, -11),
        "me": constatnt.m0 * 0.55,
        "mh": constatnt.m0 * 0.37,
    },
    "GaAs": {
        "Eg": 1.42,
        "ae": 5.35399 * Math.pow(10, 7),
        "be": 1.48331 * Math.pow(10, -11),
        "ah": 1.13786 * Math.pow(10, 6),
        "bh": 2.37672 * Math.pow(10, -12),
        "me": constatnt.m0 * 0.067,
        "mh": constatnt.m0 * 0.45,
}};