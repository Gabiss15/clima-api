const key = "1efaeca6f9da0c5c936dc24732e21780"
const input = document.querySelector('input#pesquisa')
let precipitacao = document.querySelectorAll('h4#humidty')
let tempMax = document.querySelectorAll('h4.max-temperatura')
let tempMin = document.querySelectorAll('h4.min-temperatura')
let DayOfWeek = document.querySelector("p#DayOfWeek")
let sensation = document.querySelectorAll('p.sensation')
let elementos = document.querySelectorAll("img.elemento")
var temperatura = document.querySelector('div.celsius')
let lat
let lon
let cidadePesquisada = document.querySelector('p#cidade')

var dateOfWeek = ["Domingo","Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado" ]
var week = new Date();
var number1 = dateOfWeek[week.getDay()]

var day = new Date()
var dia = day.getDate()

var month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
var mes = new Date();
var number2 = month[mes.getMonth()]

DayOfWeek.innerHTML = `${number1}, ${dia} de ${number2}`

function request(){
    let city = input.value

    let time = new Date()
    let hora = time.getHours()

    let moment 

    if (hora>= 12 && hora <= 18){
        moment = 'day'
    } else if (hora >= 0 && hora<=11){
        moment = 'night'
    } else if (hora > 18 && hora <= 23){
        moment = 'eve'
    }


    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${1}&appid=${key}`)

        .then(response => {
            response.json()

            .then (data =>{
                lat = data[0]["lat"]
                lon = data[0]["lon"]
                cidadePesquisada.innerHTML = `${data[0]["name"]}, ${data[0]["country"]}`

                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&exclude={part}&appid=${key}`)
                    .then(response =>{
                        response.json()

                        .then (data => {

                            let temperaturaNormal = data.current.temp
                            console.log(temperaturaNormal)
                            temperatura.innerHTML = `${parseInt(temperaturaNormal)}º`
                            
                            for (let h = 0; h < 7; h++ ){
                                let umidade = data['daily'][h]['humidity']
                                precipitacao[h].innerHTML = `${umidade}%`
                                console.log(umidade)
                            }

                            for (let j = 0; j < 7; j++){
                                let temperaturaMax = data['daily'][j]['temp']['max']
                                let temperaturaMin = data['daily'][j]['temp']['min']

                                tempMax[j].innerHTML = `${parseInt(temperaturaMax)}º`
                                tempMin[j].innerHTML = `${parseInt(temperaturaMin)}º`
                            }

                            for (let k = 0; k < 7; k++){
                                let clima = data['daily'][k]['weather']['0']

                                if (clima['main'] == 'Rain'){
                                    elementos[k].src = 'img/chuva.png';
                                } else if(clima['main'] == 'Clouds'){
                                    elementos[k].src = 'img/parcialnu.jpg'
                                } else if (clima['main'] == 'Thunderstorm'){
                                    elementos[k].src = 'img/chuva-forte.jpg'
                                } else {
                                    elementos[k].src = 'img/parcialnu.jpg'
                                }
                            }

                            for (let i = 0; i < 7 ; i++){
                                let sensacao = data['daily'][i]['feels_like']
                                console.log(sensacao)

                                if (moment == 'day'){
                                    sensation[i].innerHTML = `Sensação térmica: ${parseInt(sensacao['day'])}`
                                } else if(moment == 'night'){
                                    sensation[i].innerHTML = `Sensação térmica: ${parseInt(sensacao['night'])}`
                                } else {
                                    sensation[i].innerHTML = `Sensação térmica: ${parseInt(sensacao['eve'])}`
                                }
                            }

                        })
                    })
                    .catch (error =>{
                        console.log("Erro, reinicie a página e tente novamente")
                    })
            })
        })

        .catch(e => {
            console.log('Erro, reinicie a página e tente novamente')
        })
    
}
