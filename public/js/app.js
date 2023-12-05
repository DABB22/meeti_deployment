
import { OpenStreetMapProvider } from 'leaflet-geosearch'; // contiene todos los métodos para buscar en la API de openStreetMap // solo nos funciona para obtener latitud y longitud en la busqueda
import asistencia from './asistencia';
import eliminarComentario from './eliminarComentario';

// const map = L.map('mapa').setView([lat, lng], 13);

// obtener valores de la base de datos
const lat = document.querySelector('#lat').value ||  10.383672;
const lng = document.querySelector('#lng').value ||  -75.498845;
const direccion  = document.querySelector('#direccion').value || '';
const map = L.map('mapa').setView([lat, lng], 13);

let markers = new L.FeatureGroup().addTo(map); // contenedor para los markers
let marker; // marcador o pin

// Utilizar el provider y GeoCoder
const geocodeService = L.esri.Geocoding.geocodeService(); // de esta forma podemos usar el servicio de localización de reverse geocoding

// Colocar el Pin en Edición

if(lat && lng ){
    // agregar el pin
    marker = new L.marker([lat, lng], {
        draggable : true,
        autoPan: true
    })
    .addTo(map)
    .bindPopup(direccion)
    .openPopup();

    // asignar al contenedor markers
    markers.addLayer(marker);

    // detectar movimiento del marker
    marker.on('moveend', function(e) {
        marker = e.target;
        const posicion = marker.getLatLng();
        map.panTo(new L.LatLng(posicion.lat, posicion.lng) );

        // reverse geocoding, cuando el usuario reubica el pin
        geocodeService.reverse().latlng(posicion, 15 ).run(function(error, result) {

            llenarInputs(result);
        
            // asigna los valores al popup del marker
            marker.bindPopup(result.address.LongLabel);
        });
    })
}

document.addEventListener('DOMContentLoaded', () => {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // buscar la dirección
    const buscador = document.querySelector('#formbuscador');
    buscador.addEventListener('input', buscarDireccion);
})

function buscarDireccion(e) {
    if(e.target.value.length > 4) {

        // si existe un pin anterior limpiarlo
        markers.clearLayers();

        // const geocodeService = L.esri.Geocoding.geocodeService();

        const provider = new OpenStreetMapProvider();
        provider.search({ query: e.target.value }).then(( resultado ) => {
            // console.log(resultado)
            // return;

            geocodeService.reverse().latlng(resultado[0].bounds[0], 15 ).run(function(error, result) {
                llenarInputs(result);
                
                // console.log(resultado);

                // actualiza el mapa con la dirección digitada y lo centra
                map.setView(resultado[0].bounds[0], 13);

                // agregar el pin
                marker = new L.marker(resultado[0].bounds[0], {
                    draggable : true, //poder mover el pin
                    autoPan: true //centrar el mapa al mover el pin
                })
                .addTo(map)
                .bindPopup(resultado[0].label)
                .openPopup();

                // asignar al contenedor markers
                markers.addLayer(marker);


                // detectar movimiento del marker o del pin
                marker.on('moveend', function(e) { // 'moveend' evento de cuando mueves el pin y lo sueltas en el punto que quieres ahi se ejecuta la función relacionada
                    marker = e.target;
                    const posicion = marker.getLatLng();
                    map.panTo(new L.LatLng(posicion.lat, posicion.lng) ); // el mapa se centre cuando el pin se vaya moviendo

                    // reverse geocoding, cuando el usuario reubica el pin
                    geocodeService.reverse().latlng(posicion, 15 ).run(function(error, result) {

                        llenarInputs(result);
                    
                        // asigna los valores al popup del marker
                        marker.bindPopup(result.address.LongLabel);
                    });
                })
            })

        })
    }
}

function llenarInputs(resultado) {
    document.querySelector('#direccion').value = resultado.address.Address || '';
    document.querySelector('#ciudad').value = resultado.address.City || '';
    document.querySelector('#estado').value = resultado.address.Region || '';
    document.querySelector('#pais').value = resultado.address.CountryCode || '';
    document.querySelector('#lat').value = resultado.latlng.lat || '';
    document.querySelector('#lng').value = resultado.latlng.lng || '';
}