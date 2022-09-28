function addResult(){

    inputCity = document.getElementById("myInput").value;  
    historyList = getInfo();
    
    var searchCity =$("<div>") 
    searchCity.attr('id',inputCity) 
    searchCity.text(inputCity) 
    searchCity.addClass("h4")

    
    if (historyList.includes(inputCity) === false){
        $(".history").append(searchCity)
    }
    $(".subtitle").attr("style","display:inline")
    addInfo(inputCity);
    
}; 

//  add event listener 
$(".history").on('click', function(event){
    event.preventDefault();
    $(".subtitle").attr("style","display:inline")
     document.getElementById("myInput").value =  event.target.id;
    getResult(); 
});

//  add event listner to search Button
document.getElementById("searchBtn").addEventListener("click", addResult);
document.getElementById("searchBtn").addEventListener('click', getResult);

// get weather conditions function
function getResult(){   

    $(".five-day").empty();
    $(".city").empty()

   inputCity = document.getElementById("myInput").value;   
    var countryCode='US';    
    var cityCode=inputCity;       
    
    var geoLon;   
    var geoLat;
        
    var cityName =$("<h>")    
    cityName.addClass("h3")  
    var temp = $("<div>")    
    var wind = $("<div>")    
    var humidity = $("<div>")   
    var uvIndex = $("<div>")  
    var icon =$("<img>")
    icon.addClass("icon");    
    var dateTime = $("<div>")

    $(".city").addClass("list-group")
    $(".city").append(cityName)    
    $(".city").append(dateTime)    
    $(".city").append(icon)    
    $(".city").append(temp)    
    $(".city").append(wind)    
    $(".city").append(humidity)    
    $(".city").append(uvIndex)
    
    
    var Url = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityCode + "," + countryCode + "&limit=5&appid=06097785fc84a41f613d692263081d78"
        
      fetch(Url)
        .then(function (response) {
          return response.json();
        })
    
        .then(function (data) {
          geoLon = data[0].lon;
          geoLat = data[0].lat;
    
          // fetching current weather
          var weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + geoLat + "&lon="+ geoLon + "&appid=06097785fc84a41f613d692263081d78"
            
          fetch(weatherUrl)

          .then(function (response) {
            return response.json();
          })
          .then(function (data) {

            
            cityName.text(cityCode);
            // grabbing date 
            var date = new Date(data.current.dt * 1000);
            dateTime.text("("+ (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + ")");

            temp.text("Temperature: "+ data.current.temp + " F");
            humidity.text("Humidity: " + data.current.humidity + " %");
            wind.text("Wind Speed: " + data.current.wind_speed + " MPH");

            
            // checking UV Index   
            var uvi =$("<div>")
            uvIndex.text("UV Index: ");
            uvi.text(data.current.uvi)
            uvIndex.append(uvi)
            uvIndex.addClass("d-flex")
            
            if (data.current.uvi < 3){
                uvi.attr("style","background-color:green; color:black; margin-left: 5px")
            } else if (data.current.uvi < 6){
                uvi.attr("style","background-color:yellow; color:black; margin-left: 5px")
            } else if (data.current.uvi < 8){
                uvi.attr("style","background-color:orange; color:black; margin-left: 5px")
            } else if (data.current.uvi < 11) {
                uvi.attr("style","background-color:red; color:black; margin-left: 5px")
            } else {
                uvi.attr("style","background-color:purple; color:black; margin-left: 5px")
            }

            // Future weather loop
            for (var i=1;i<6;i++){

                var FullContainer = $("<div>")
                this["futureDate"+i] = $("<h>")
                this["futureIcon"+i] = $("<img>")
                this["futureTemp"+i] = $("<div>")
                this["futureWind"+i] = $("<div>")
                this["futureHumidity"+i] = $("<div>")
                // show dates 
                this["forecastDay"+i] = new Date(data.daily[i].dt * 1000);     
     
                (this["futureDate"+i]).text(((this["forecastDay"+i]).getMonth()+1) + "/" + (this["forecastDay"+i]).getDate() + "/" + (this["forecastDay"+i]).getFullYear());
                (this["futureTemp"+i]).text("Temperature: "+ data.daily[i].temp.day + " F");
                (this["futureWind"+i]).text("Wind: "+ data.daily[i].wind_speed+ " MPH");
                (this["futureHumidity"+i]).text("Humidity: " + data.daily[i].humidity + " %");
                (this["weatherIcon"+i])= data.daily[i].weather[0].icon;
        
                DateimgSrc = "https://openweathermap.org/img/wn/" + (this["weatherIcon"+i]) + ".png";  
                (this["futureIcon"+i]).attr('src',DateimgSrc)

                $(".five-day").append(FullContainer)
                FullContainer.append((this["futureDate"+i]));
                FullContainer.append((this["futureIcon"+i]));
                FullContainer.append((this["futureTemp"+i]));
                FullContainer.append((this["futureWind"+i]));
                FullContainer.append((this["futureHumidity"+i]));

                FullContainer.addClass("weather-card")
            }

          })
    })
}

// local storage info
function getInfo() {
    var currentList =localStorage.getItem("city");
    if (currentList !== null ){
        freshList = JSON.parse(currentList);
        return freshList;
    } else {
        freshList = [];
    }
    return freshList;
}
// add info to local
function addInfo (n) {
    var addedList = getInfo();

    if (historyList.includes(inputCity) === false){
        addedList.push(n);
    }
   
    localStorage.setItem("city", JSON.stringify(addedList));
};
// render history
function renderInfo () {
    var historyList = getInfo();
    for (var i = 0; i < historyList.length; i++) {
        var inputCity = historyList[i];
        var searchCity =$("<div>") 
        searchCity.attr('id',inputCity) 
        searchCity.text(inputCity) 
        searchCity.addClass("h4")

        $(".history").append(searchCity)
    }
};

renderInfo();


