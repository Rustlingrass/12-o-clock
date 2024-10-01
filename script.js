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

// Set the camera position
camera.position.z = 50;

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

  // Update controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Add user control for camera rotation, zoom, and pan
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Start animation
animate();
