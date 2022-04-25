const key = "1efaeca6f9da0c5c936dc24732e21780"
const keyFlickr = "809e1b7d6c2902653b36858f5295b87e"
const input = document.querySelector('input#pesquisa')
var cityLegend = document.querySelector('h5#cidade-legenda')
let precipitacao = document.querySelectorAll('h4#humidty')
let tempMax = document.querySelectorAll('h4.max-temperatura')
let tempMin = document.querySelectorAll('h4.min-temperatura')
let DayOfWeek = document.querySelector("p#DayOfWeek")
let sensation = document.querySelector('p.sensation')
let sunset = document.querySelector('p.sunset')
let elementos = document.querySelectorAll("img.elemento")
var temperatura = document.querySelector('div.celsius')
let barra = document.querySelectorAll('div.barra')
var graficMax = document.getElementsByClassName('max-temp')
var graficMin = document.getElementsByClassName('min-temp')
var indexUV = document.querySelector('section.index-uv')
var scaleUV = document.querySelector('p#scale-uv')
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

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${1}&appid=${key}`)

        .then(response => {
            response.json()

            .then (data =>{
                lat = data[0]["lat"]
                lon = data[0]["lon"]
                cidadePesquisada.innerHTML = `${data[0]["name"]}, ${data[0]["country"]}`
                let dataGeographic = data;

                let state = data[0]['state']
                let cityUpper = city[0].toUpperCase() + city.substr(1)
                cityLegend.innerHTML = `${cityUpper}, ${state}`

                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&exclude={part}&appid=${key}`)
                    .then(response =>{
                        response.json()

                        .then (data => {

                            let temperaturaNormal = data.current.temp
                            console.log(temperaturaNormal)
                            temperatura.innerHTML = `${parseInt(temperaturaNormal)}º`

                            for (let g = 0; g < 7; g++){
                                let grafic = data['daily'][g]['humidity']

                                if (grafic > 0 && grafic <= 50){
                                    barra[g].style.height = '200px'
                                } else if (grafic > 50 && grafic <= 85){
                                    barra[g].style.height = '140px' 
                                } else {
                                    barra[g].style.height = '100px'
                                }
                            }
                            
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

                            for (let l = 0; l < 7; l++){
                                let temperaturaMax = data['daily'][l]['temp']['max']
                                let p1 = parseInt(temperaturaMax) 
                                console.log("Temp Máx.",p1)

                                graficMax[l].style.width = `${p1}px`

                                let temperaturaMin = data['daily'][l]['temp']['min']
                                let p1Min = parseInt(temperaturaMin) 
                                console.log("Temp Mín", p1Min)

                                graficMin[l].style.width = `${p1Min}px`
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

                            let sensacao = data.current.feels_like
                            console.log('Sensação' + sensacao)
                            sensation.innerHTML = `Sensação térmica: ${parseInt(sensacao)}º`

                            let porDoSol = data.current.sunset 
                            let sunsetConvert = new Date (0)

                            sunsetConvert.setUTCSeconds(porDoSol)
                            var ps = sunsetConvert.toLocaleTimeString()

                            console.log(ps)

                            sunset.innerHTML = `Pôr do Sol: ${ps}`

                            let percentUV = data.current.uvi
                            console.log('uv', percentUV)
                            indexUV.style.height = '150px'
                            scaleUV.innerHTML = `${percentUV}%`

                            if(percentUV>=3 && percentUV <=5.9 ){
                                indexUV.style.backgroundColor = 'yellow'
                            } else if (percentUV > 5.9 && percentUV <= 7.9 ){
                                indexUV.style.backgroundColor = 'orange'
                            } else if (percentUV > 7.9 && percentUV <= 10.9){
                                indexUV.style.backgroundColor = 'red'
                            } else if (percentUV > 11){
                                indexUV.style.backgroundColor = 'rgb(50, 18, 61)'
                            } else {
                                indexUV.style.backgroundColor = 'gray'
                            }

                            let cidadaPesquisa = `${dataGeographic[0]["name"]} ${dataGeographic[0]["state"]} ${dataGeographic[0]["country"]}`

                            fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${keyFlickr}&text=${cidadaPesquisa}&sort=relevance&privacy_filter=1&format=json&nojsoncallback=1`)
                            .then(response => {
                                response.json()
                                .then(data => {
                                    console.log(data)
                                    
                                    var imgCidades = document.querySelectorAll("img.imgCidades")
                                    console.log(imgCidades)

                                    for (let i = 0; i<=2; i++){
                                        let id = data["photos"]["photo"][0]["id"]
                                        let server = data["photos"]["photo"][0]["server"]
                                        let secret = data["photos"]["photo"][0]["secret"]
                                        
                                        let src = `https://live.staticflickr.com/${server}/${id}_${secret}_n.jpg`//url reveladora
                                        imgCidades[0].src = src
                                    }

                                    
                                })
                                .catch(e => {
                                    console.log(e)
                                })
                            })
                            .catch(error => {
                                console.log(error)
                            })

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