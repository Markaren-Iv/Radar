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



var currentDegree = 0;
var currentDistance_sr = 0; 
var currentDistance_an = 0; 

var Distances_sr = [];
var Distances_an = [];


const p_distance_sr = document.getElementById("distance_sr");
const p_angle_sr = document.getElementById("angle_sr");
const p_distance_an = document.getElementById("distance_an");
const p_angle_an = document.getElementById("angle_an");
// Listen for changes in the Firebase Realtime Database.
// Assumes data is stored under the "radarData" node with properties "degree" and "distance".
var radarRef = database.ref('radarData');
radarRef.on('value', function(snapshot) {
var data = snapshot.val();
if (data) {
  currentDegree = -1* data.degree;
  currentDistance_sr = data.distance_sr < 40 ?  data.distance_sr : 40;
  currentDistance_an =  data.distance_an;
  console.log(currentDistance_sr);

  Distances_an[currentDegree] =  currentDistance_an;
  Distances_sr[currentDegree] = currentDistance_sr;
  
  p_distance_sr.textContent = "Distance: " + data.distance_sr + " cm";
  p_angle_sr.textContent = "Angle: " + data.degree;
  p_distance_an.textContent = "Distance: " +  data.distance_an + " cm";
  p_angle_an.textContent = "Angle: " + (data.degree + 180);
}
});


// Setup the canvas and drawing context
var canvas = document.getElementById('radarCanvas');
var ctx = canvas.getContext('2d');
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var maxRadius = Math.min(centerX, centerY) - 20; // leave some margin
var maxDistance = 40;
// Function to draw the radar
function drawRadar() {
// Clear the canvas for redrawing
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw concentric circles
ctx.strokeStyle = "#C0C0C0";
ctx.lineWidth = 1;
for (var i = 1; i <= 4; i++) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, (maxRadius / 4) * i, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.font = "10px Arial";       
  ctx.fillStyle = "white";          
  ctx.textAlign = "center";          
  ctx.textBaseline = "middle";       

  var num = String((maxDistance / 4) * i);
  ctx.fillText(num, ((maxRadius / 4) * i) + maxRadius + 5, (canvas.height / 2) - 10 );
}

// Draw the cross lines (axes)
ctx.beginPath();
ctx.moveTo(centerX - maxRadius, centerY);
ctx.lineTo(centerX + maxRadius, centerY);
ctx.moveTo(centerX, centerY - maxRadius);
ctx.lineTo(centerX, centerY + maxRadius);
ctx.stroke();

// Convert degree to radian (adjust so 0° is up).
var radian = (currentDegree) * Math.PI / 180;

// Here we normalize currentDistance to the radar scale.
var normalizedDistance_sr = (maxRadius / maxDistance)*currentDistance_sr;
var normalizedDistance_an = (maxRadius / maxDistance)*currentDistance_an;
// ultrasound point
normalizedDistance_sr = Math.min(normalizedDistance_sr, maxRadius);
var pointX_sr = centerX + normalizedDistance_sr * Math.cos(radian);
var pointY_sr = centerY + normalizedDistance_sr * Math.sin(radian);

// analog point
normalizedDistance_sr = Math.min(normalizedDistance_sr, maxRadius);
var pointX_an = centerX + normalizedDistance_an * Math.cos(radian + Math.PI);
var pointY_an = centerY + normalizedDistance_an * Math.sin(radian + Math.PI);

// var xEnd_sr = centerX + maxRadius * Math.cos(radian);
// var yEnd_sr = centerY + maxRadius * Math.sin(radian);
// var xEnd_an = centerX + maxRadius * Math.cos(radian + Math.PI);
// var yEnd_an = centerY + maxRadius * Math.sin(radian + Math.PI);
ctx.strokeStyle = '#00FF00';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(centerX, centerY);
ctx.lineTo(pointX_sr, pointY_sr);
ctx.stroke();
ctx.strokeStyle = '#0000FF';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(centerX, centerY);
ctx.lineTo(pointX_an, pointY_an);
ctx.stroke();
 //the angles are negative because for drawing you have to reverse the angle
if(currentDegree !== 0 && currentDegree !== -180)
{
for(var i = 0; i > -180; i--){
  if (Distances_sr[i] != 0){
    var radian_l = i * Math.PI / 180;
    var normalizedDistance_sr_l = (maxRadius / maxDistance)*Distances_sr[i];
    var pointX_sr_l = centerX + normalizedDistance_sr_l * Math.cos(radian_l);
    var pointY_sr_l = centerY + normalizedDistance_sr_l * Math.sin(radian_l);
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(pointX_sr_l, pointY_sr_l, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
  
}

for(var i = 0; i > -180; i--){
  if (Distances_an[i] != 0){
    var radian_l = (i* Math.PI / 180) + Math.PI;
    var normalizedDistance_an_l = (maxRadius / maxDistance)*Distances_an[i];
    var pointX_an_l = centerX + normalizedDistance_an_l * Math.cos(radian_l);
    var pointY_an_l = centerY + normalizedDistance_an_l * Math.sin(radian_l);
    ctx.fillStyle = '#f50';
    ctx.beginPath();
    ctx.arc(pointX_an_l, pointY_an_l, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}
}
else{
  Distances_sr = new Array(180).fill(0);
  Distances_an = new Array(180).fill(0);
}

//draws a point sr
ctx.fillStyle = '#f00';
ctx.beginPath();
ctx.arc(pointX_sr, pointY_sr, 5, 0, 2 * Math.PI);
ctx.fill();

//draws a point an
ctx.fillStyle = '#f50';
ctx.beginPath();
ctx.arc(pointX_an, pointY_an, 5, 0, 2 * Math.PI);
ctx.fill();

}

// Animation loop using requestAnimationFrame
function animate() {
drawRadar();
requestAnimationFrame(animate);
}
animate();