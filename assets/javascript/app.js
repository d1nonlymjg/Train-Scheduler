// Initialize Firebase
var config = {
    apiKey: "AIzaSyCv6YRS03oLLz_YUREjRnY6H3YlFE2N4KY",
    authDomain: "the-train-is-late.firebaseapp.com",
    databaseURL: "https://the-train-is-late.firebaseio.com",
    storageBucket: "the-train-is-late.appspot.com",
    messagingSenderId: "162927439246"
};
firebase.initializeApp(config);

//Create a variable to reference the database
var database = firebase.database();

$("#addBtn").on("click", function() {
    //Grab user input
    var trainName = $("#trainName").val().trim();
    var trainDestination = $("#destination").val().trim();
    var trainfrequencyinMinutes = $("#frequencyinMinutes").val().trim();
    var firstTrainTime = $("#firstTrainTime").val().trim();
    //temporary object for train data
    var newTrain = {
        train: trainName,
        destination: trainDestination,
        firstTrainTime: firstTrainTime,
        frequency: trainfrequencyinMinutes
    };

    //uploads train data
    database.ref().push(newTrain);

    //clears all text boxes
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrainTime").val("");
    $("#frequencyinMinutes").val("");

    //prevents page from reloading
    return false;
});

// firebase event for adding trains to database and row in html when user adds entry
database.ref().on("child_added", function(childSnapshot) {

    var trainName = childSnapshot.val().train;
    var trainDestination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var trainfrequencyinMinutes = childSnapshot.val().frequency;
    //formatted firstTrainTime with .unix
    var firstTrainTimeFormat = moment.unix(firstTrainTime).format("hh:mm a");
    //subtracted firstTrainTimeFormat variable one year before
    var trainFirstTimeConverted = moment(firstTrainTimeFormat, "hh:mm a").subtract(1, "years");
    //displays current time in 24hour format
    var currentTime = moment().format("HH:mm a");;
    //the difference between first time in minutes
    var diffTime = moment().diff(moment(trainFirstTimeConverted), "minutes");

    var trainRemainder = diffTime % trainfrequencyinMinutes;

    var trainMinutesAway = trainfrequencyinMinutes - trainRemainder;

    var trainNextArrival = moment().add(trainMinutesAway, "minutes");

    var trainNextArrival = moment(trainNextArrival).format("hh:mm a");
    
    //append all values to the id of traintable
    $("#trainTable").append("<tr><td>" + trainName + "</td>" + "<td>" + trainDestination + "</td>" + "<td>" + trainfrequencyinMinutes + "</td>" + "<td>" + trainNextArrival + "</td>" + "<td>" + trainMinutesAway + "</td></tr>");

});
