const firebaseConfig = {
    apiKey: "AIzaSyDxwejbnr5dIh_ZsVCt4vKynWrdoEVK_nY",
    authDomain: "radar-e87b0.firebaseapp.com",
    databaseURL: "https://radar-e87b0-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "radar-e87b0",
    storageBucket: "radar-e87b0.firebasestorage.app",
    messagingSenderId: "625695609864",
    appId: "1:625695609864:web:3994874dcaf4d8142c6dbd",
    measurementId: "G-MMWE12CNDV"
    };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

  
const p_temperature = document.getElementById("temp");
const p_humidity = document.getElementById("hum");

var TempHumRef = database.ref('TempHum');
TempHumRef.on('value', function(snapshot) {
var data = snapshot.val();
if (data) {
    p_temperature.textContent = data.temperature + " °C";
    p_humidity.textContent = data.humidity + " %";
}
});

  
  