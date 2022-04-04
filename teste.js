const key = "1efaeca6f9da0c5c936dc24732e21780"
const keyFlickr = "809e1b7d6c2902653b36858f5295b87e"
const input = document.querySelector('input#pesquisa')
let precipitacao = document.querySelectorAll('h4#humidty')
let tempMax = document.querySelectorAll('h4.max-temperatura')
let tempMin = document.querySelectorAll('h4.min-temperatura')
let DayOfWeek = document.querySelector("p#DayOfWeek")
let sensation = document.querySelector('p.sensation')
let sunset = document.querySelector('p.sunset')
let lat
let lon
let cidadePesquisada = document.querySelector('p#cidade')

function request(){
    let city = input.value

    var dateOfWeek = ["Domingo","Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado" ]
    var week = new Date();
    var number1 = dateOfWeek[week.getDay()]

    var day = new Date()
    var dia = day.getDate()
    var month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    var mes = new Date();
    var number2 = month[mes.getMonth()]

    let time = new Date()
    let hora = time.getHours()

    let moment 

    DayOfWeek.innerHTML = `${number1}, ${dia} de ${number2}`

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${1}&appid=${key}`)

        .then(response => {
            response.json()

            .then (data =>{
                lat = data[0]["lat"]
                lon = data[0]["lon"]
                cidadePesquisada.innerHTML = `${data[0]["name"]}, ${data[0]["country"]}`
                let dataGeographic = data;

                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&exclude={part}&appid=${key}`)
                    .then(response =>{
                        response.json()

                        .then (data => {
                            /*data.daily.forEach((valor) => {
                                const temperaturaMax = valor.temp.max
                                const temperaturaMin = valor.temp.min
    
                                tempMax.innerHTML = `${temperaturaMax}º`
                                tempMin.innerHTML = `${temperaturaMin}º`

                                console.log(`Temperatura  Máxima: ${temperaturaMax}`)
                                console.log(`Temperatura Mínima: ${temperaturaMin}`)
                            })
                            /*data.daily.forEach((elemento) => {

                                let umidade = elemento.humidity
                                //console.log("umidade:", umidade)
                                precipitacao.innerHTML = umidade + "%"
                                
                            })*/

                            //Duas tentativas diferentes de pegar a umidade
                            
                            for (let h = 0; h < 7; h++ ){
                                let umidade = data['daily'][h]['humidity']
                                precipitacao[h].innerHTML = `${umidade}%`
                                console.log(umidade)
                            }

                            for (let j = 0; j < 7; j++){
                                let temperaturaMax = data['daily'][j]['temp']
                                tempMax.innerHTML = `${temperaturaMax['max']}º`
                                console.log(temperaturaMax)

                            }

                            let sensacao = data.current.feels_like
                            console.log(sensacao)
                            sensation.innerHTML = `Sensação térmica: ${parseInt(sensacao)}`

                            let porDoSol = data.current.sunset 
                            sunset.innerHTML = `Pôr do Sol: ${porDoSol}`

                            let cidadaPesquisa = dataGeographic[0]["name"] + " " + dataGeographic[0]["state"] + " " + dataGeographic[0]["country"]

                            fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${keyFlickr}&text=${cidadaPesquisa}&sort=relevance&privacy_filter=1&format=json&nojsoncallback=1`)
                                .then(response => {
                                    response.json()
                                    .then(data => {
                                        console.log(data)
                                        const imgCidades = document.querySelectorAll("img.imgCidades")
                                        console.log(imgCidades)
                                        
                                        let id = data["photos"]["photo"][0]["id"]
                                        let server = data["photos"]["photo"][0]["server"]
                                        let secret = data["photos"]["photo"][0]["secret"]
                                        
                                        let src = `https://live.staticflickr.com/${server}/${id}_${secret}_n.jpg`//url reveladora
                                        imgCidades[0].src = src
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
