


function saveLoc(loc) {
    //add this to the saved locations array
    if (savedLocations === null) {
        savedLocations = [loc];
    }
    else if (savedLocations.indexOf(loc) === -1) {
        savedLocations.push(loc);
    }
    //save the new array to localstorage
    localStorage.setItem("weathercities", JSON.stringify(savedLocations));
    showPrevious();
}

let savedLocations = [];
let currentLoc;

function initialize() {
    //grab previous locations from local storage
    savedLocations = JSON.parse(localStorage.getItem("weathercities"));

    //display buttons for previous searches
    if (savedLocations) {
        //get the last city searched so we can display it
        currentLoc = savedLocations(savedLocations.length - 1);
        showPrevious();
        getCurrent(currentLoc);
    }
    else {
        //try to geolocate, otherwise set city to raleigh
        if (!navigator.geolocation) {
            //can't geolocate and no previous searches, so just give them one
            getCurrent("Raleigh");
        }
        /* else {
             navigator.geolocation.getCurrentPosition(success, error);
         }*/
    }

}




function getCurrent(city) {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=7e4c7478cc7ee1e11440bf55a8358ec3&units=imperial";
    $.ajax({
        url: queryURL,
        method: "GET",
        error: function () {
            savedLocations.splice(savedLocations.indexOf(city), 1);
            localStorage.setItem("weathercities", JSON.stringify(savedLocations));
            initialize();
        }
    }).then(function (response) {
        //create the card


        let currCard = $("<div>");
        $("#earthforecast").append(currCard);

        //add location to card header

        let currCardHead = $("<div>").attr("class", "test1").text("Your Current Weather at :");
        currCard.append(currCardHead);


        let cardRow = $("<div>").attr("class", "row ");
        $("#earthforecast").append(cardRow);

        //get icon for weather conditions
        let iconURL = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

        let imgDiv = $("<div>").append($("<img>").attr("src", iconURL).attr("class", "card-img"));

        cardRow.append(imgDiv);





        let textDiv = $("<ul>").attr("class", "");

        let cardBody = $("<ul>").attr("class", "");

        textDiv.append(cardBody);


        //display city name
        cardBody.append($("<h3>").attr("class", "city-name").text(response.name));

        //display last updated
        let currdate = moment(response.dt, "X").format("dddd, MMMM Do YYYY, h:mm a");
        cardBody.append($("<p>").attr("class", "card-text").append($("<small>").attr("class", "text-muted").text("Last updated: " + currdate)));

        //display Temperature
        cardBody.append($("<li>").attr("class", "card-text").html("Temperature: " + response.main.temp + " &#8457;"));

        //display Humidity
        cardBody.append($("<li>").attr("class", "card-text").text("Humidity: " + response.main.humidity + "%"));

        //display Wind Speed
        cardBody.append($("<li>").attr("class", "card-text").text("Wind Speed: " + response.wind.speed + " MPH"));


        //get UV Index
        let uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=7e4c7478cc7ee1e11440bf55a8358ec3&lat=" + response.coord.lat + "&lon=" + response.coord.lat;
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (uvresponse) {
            let uvindex = uvresponse.value;
            let bgcolor;
            if (uvindex <= 3) {
                bgcolor = "#8B008B";
            }
            else if (uvindex >= 3 || uvindex <= 6) {
                bgcolor = "#006400";
            }
            else if (uvindex >= 6 || uvindex <= 8) {
                bgcolor = "#DB7093";
            }
            else {
                bgcolor = "#B22222";
            }
            let uvdisp = $("<li>").attr("class", "card-text").text("UV Index: ");
            uvdisp.append($("<span>").attr("class", "uvindex").attr("style", ("background-color:" + bgcolor)).text(uvindex));
            cardBody.append(uvdisp);

        });

        cardRow.append(textDiv);
        getForecast(response.id);
    });
}




function getForecast(city) {
    //get 5 day forecast
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + city + "&APPID=7e4c7478cc7ee1e11440bf55a8358ec3&units=imperial";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //add container div for forecast cards
        let newrow = $("<div>").attr("class", "forecast");
        $("#earthforecast").append(newrow);

        //loop through array response to find the forecasts for 15:00
        for (let i = 0; i < response.list.length; i++) {
            if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {

                let newCol = $("<div>").attr("class", "one-fifth");
                newrow.append(newCol);

                let newCard = $("<div>").attr("class", "background");
                newCol.append(newCard);

                let cardHead = $("<div>").attr("class", "").text(moment(response.list[i].dt, "X").format("MMM Do"));
                newCard.append(cardHead);

                let cardImg = $("<img>").attr("class", "").attr("src", "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png");
                newCard.append(cardImg);

                let bodyDiv = $("<div>").attr("class", "");
                newCard.append(bodyDiv);

                bodyDiv.append($("<h3>").attr("class", "card-text").html("Temp: " + response.list[i].main.temp + " &#8457;"));
                bodyDiv.append($("<h3>").attr("class", "card-text").text("Humidity: " + response.list[i].main.humidity + "%"));
            }
        }
    });
}
function showPrevious() {
    //show the previously searched for locations based on what is in local storage
    if (savedLocations) {
        $("#prevSearches").empty();
        var btns = $("<div>").attr("class", "list-group");
        for (var i = 0; i < savedLocations.length; i++) {
            var locBtn = $("<a>").attr("href", "#").attr("id", "loc-btn").text(savedLocations[i]);
            if (savedLocations[i] == currentLoc) {
                locBtn.attr("class", "list-group-item list-group-item-action active");
            }
            else {
                locBtn.attr("class", "list-group-item list-group-item-action");
            }
            btns.prepend(locBtn);
        }
        $("#prevSearches").append(btns);
    }
}







/*function showPrevious() {
    //show the previously searched for locations based on what is in local storage
    if (savedLocations) {
        $("#prevSearches").empty();
        let btns = $("<ul>").attr("class", "");
        for (let i = 0; i < savedLocations.length; i++) {
            let locBtn = $("<li>").attr("id", "previous").text(savedLocations[i]);
            if (savedLocations[i] == currentLoc) {
                locBtn.attr("class", "apple3");
            }
            else {
                locBtn.attr("class", "apple");
            }
            btns.prepend(locBtn);
        }
        $("#prevSearches").append(btns);
    }
}*/


function clear() {
    //clear all the weather
    $("#earthforecast").empty();
}


$("#searchbtn").on("click", function () {
    //don't refresh the screen
    event.preventDefault();
    //grab the value of the input field
    let loc = $("#searchinput").val().trim();
    //if loc wasn't empty
    if (loc !== "") {
        //clear the previous forecast
        clear();
        currentLoc = loc;
        saveLoc(loc);
        //clear the search field value
        $("#searchinput").val("");
        //get the new forecast
        getCurrent(loc);
    }
});

let resetBtn = document.querySelector("#resetBtn");
let clearLocation = document.querySelector("#prevSearches");

resetBtn.addEventListener("click", clearHistory);

function clearHistory() {
    localStorage.removeItem("weathercities");
   
}

$(document).ready(function(){
    $("#resetBtn").click(function(){
        $("li").remove();
    });
} );