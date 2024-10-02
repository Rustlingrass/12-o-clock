// script.js

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('solar-system').appendChild(renderer.domElement);
// Add lights to simulate the Sun
const pointLight = new THREE.PointLight(0xffffff, 2, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Add ambient light to brighten the entire scene
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Adjust the intensity as needed
scene.add(ambientLight);

// Create Sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets array to hold all the planets
const planets = [];

// Function to create planets
function createPlanet(size, distance, color) {
  const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
  const planetMaterial = new THREE.MeshLambertMaterial({ color });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);

  // Add orbit distance from the Sun
  planet.position.x = distance;
  scene.add(planet);
  planets.push({ planet, distance, angle: Math.random() * Math.PI * 2 });
}

// Create planets with size and distance from the Sun
createPlanet(0.5, 5, 0xff0000);  // Mercury
createPlanet(0.8, 7, 0xff9900);  // Venus
createPlanet(1, 10, 0x0000ff);   // Earth
createPlanet(0.9, 15, 0xff3300); // Mars
createPlanet(1.2, 20, 0xffcc00); // Jupiter
createPlanet(1.1, 25, 0xff6600); // Saturn
createPlanet(0.9, 30, 0x33ccff); // Uranus
createPlanet(0.8, 35, 0x3366ff); // Neptune

// Create starfield (sky full of stars)
function createStarfield() {
  const starsGeometry = new THREE.BufferGeometry();
  const starCount = 10000;  // Number of stars
  const starVertices = [];

  for (let i = 0; i < starCount; i++) {
    // Random positions for stars
    const x = (Math.random() - 0.5) * 2000; // Adjust range for star spread
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
  }

  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

  // Star material: small white points
  const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });

  // Create star points from geometry and material
  const starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);
}

// Create the starfield
createStarfield();

// Set initial camera position and angles
let cameraDistance = 50;
let cameraAngleX = 0;
let cameraAngleY = 0;

// Update camera position based on angles
function updateCameraPosition() {
  camera.position.x = cameraDistance * Math.sin(cameraAngleX) * Math.cos(cameraAngleY);
  camera.position.z = cameraDistance * Math.cos(cameraAngleX) * Math.cos(cameraAngleY);
  camera.position.y = cameraDistance * Math.sin(cameraAngleY);
  camera.lookAt(0, 0, 0);  // Always look at the Sun (center of the scene)
}

// Initial update for the camera
updateCameraPosition();

// Orbit speed for each planet (for simplicity, random values)
const orbitSpeeds = [0.03, 0.02, 0.01, 0.008, 0.006, 0.004, 0.003, 0.002];

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate planets around the Sun
  planets.forEach((obj, index) => {
    obj.angle += orbitSpeeds[index];  // Adjust the speed for each planet
    obj.planet.position.x = obj.distance * Math.cos(obj.angle);
    obj.planet.position.z = obj.distance * Math.sin(obj.angle);
  });

  // Render the scene
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Handle keyboard input to control the camera with arrow keys
document.addEventListener('keydown', (event) => {
  const key = event.key;

  const rotationSpeed = 0.05;  // Adjust speed of rotation

  if (key === 'ArrowLeft') {
    cameraAngleX -= rotationSpeed;
  }
  if (key === 'ArrowRight') {
    cameraAngleX += rotationSpeed;
  }
  if (key === 'ArrowUp') {
    cameraAngleY = Math.min(cameraAngleY + rotationSpeed, Math.PI / 2); // Limit the vertical angle to avoid flipping
  }
  if (key === 'ArrowDown') {
    cameraAngleY = Math.max(cameraAngleY - rotationSpeed, -Math.PI / 2); // Limit the vertical angle to avoid flipping
  }

  updateCameraPosition();  // Update camera position based on new angles
});

document.addEventListener("wheel", (event) => {
const zoomSpeed = 5;

if (event.deltaY < 0) {
  // Zoom in
  cameraDistance = Math.max(10, cameraDistance - zoomSpeed);  // Prevent zooming too close
} else {
  // Zoom out
  cameraDistance = Math.min(200, cameraDistance + zoomSpeed); // Prevent zooming too far
}

updateCameraPosition();  // Update camera position after zooming
});
// Start animation
animate();
