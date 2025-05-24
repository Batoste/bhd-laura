import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './handwriting.css';




const questions = [
  {
    image: 'photos/1.jpg',
    correctCoords: [49.107331052038305, 6.18123835652634], 
  },
  {
    image: 'photos/2.jpg',
    correctCoords: [49.113259636282514, 6.177827684276134], 
  },
  {
    image: 'photos/3.jpg',
    correctCoords: [48.58935862455131, 7.7392249354907605], 
  },
  {
    image: 'photos/4.jpg',
    correctCoords: [49.112689355606136, 6.176273349629525],  
  },
    {
    image: 'photos/5.jpg',
    correctCoords: [43.90512823093828, 15.971214294306508],  
  },
    {
    image: 'photos/6.jpg',
    correctCoords: [44.13893598196218, 15.213475139173504],  
  },
    {
    image: 'photos/7.JPG',
    correctCoords: [49.124750893725356, 6.218749052071443],  
  },
    {
    image: 'photos/9.JPG',
    correctCoords: [41.14246920421423, -8.612131262474401],  
  },
    {
    image: 'photos/10.JPG',
    correctCoords: [49.242407971000056, 6.128490356891259],  
  },
    {
    image: 'photos/11.JPG',
    correctCoords: [49.11652621358157, 6.167097056397102],  
  },
    {
    image: 'photos/12.JPG',
    correctCoords: [49.112956813879144, 6.162477563253665],  
  },
      {
    image: 'photos/13.JPG',
    correctCoords: [49.116518987850434, 6.179445275531228],  
  },
      {
    image: 'photos/14.JPG',
    correctCoords: [49.11113128464682, 6.17986223611476],  
  },
      {
    image: 'photos/15.JPG',
    correctCoords: [49.150021810361274, 6.188822003278365],  
  },
      {
    image: 'photos/16.JPG',
    correctCoords: [49.11064444096531, 6.1768104238979005],  
  },

];

const finalMemories = [
  {
    coords: [49.11562753083911, 6.164537037769383],
    label: 'Plan d eau',
    text: 'Notre premier bisous 🇫🇷',
  },
  {
    coords: [41.15233959711629, -8.623981779476665],
    label: 'Porto',
    text: 'Notre premier voyage',
  },
  {
    coords: [42.660028754001274, 18.110938668305582],
    label: 'Croatie',
    text: 'Notre deuxième voyage',
  },
  {
    coords: [49.12460542153562, 6.218714231514911],
    label: 'Chez moi haha',
    text: 'Notre première fois',
  },
  {
    coords: [49.11612937933429, 6.161633245626577],
    label: 'Plan d eau',
    text: 'Notre endroit favori à l epoque',
  },
  {
    coords: [49.1343131489736, 6.198423583622604],
    label: 'Bowling',
    text: 'Notre activité préférée',
  },
  
  {
    coords: [48.86759808105792, 2.348093603816912],
    label: 'Paris',
    text: 'Notre prochain voyage',
  },

];


function radians(deg: number) {
  return deg * (Math.PI / 180);
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = radians(lat2 - lat1);
  const dLon = radians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radians(lat1)) *
      Math.cos(radians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateAngle(lat1: number, lon1: number, lat2: number, lon2: number) {
  const deltaLon = lon2 - lon1;
  const x = Math.atan2(deltaLon, lat2 - lat1);
  const angle = (x * 180) / Math.PI;
  return (angle + 360) % 360;
}

function GuessMap({ onGuess }: { onGuess: (coords: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onGuess([e.latlng.lat, e.latlng.lng] as [number, number]);
    },
  });
  return null;
}

export default function BirthdayGeoGame() {
  const [current, setCurrent] = useState(0);
  const [message, setMessage] = useState('');
  const [guessed, setGuessed] = useState(false);
  const [userGuess, setUserGuess] = useState<[number, number] | null>(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [arrowAngle, setArrowAngle] = useState<number | null>(null);


  const markerRef = useRef<any>(null);

   useEffect(() => {
    if (arrowAngle !== null && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [arrowAngle]);



  const q = questions[current];

  function handleGuess(coords: [number, number]) {
    const [lat1, lng1] = coords;
    const [lat2, lng2] = q.correctCoords;
    const dist = Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));
    setUserGuess(coords);
    setGuessed(true);
    if (dist < 0.001) {
      setArrowAngle(null);
      setMessage("Bravo continue t'es plus forte que ce que je pensais :)");
      setTimeout(() => {
        if (current + 1 < questions.length) {
          setCurrent(current + 1);
          setGuessed(false);
          setUserGuess(null);
          setMessage('');
        } else {
          setFinished(true);
        }
      }, 2000);
    } else {
      const angle = calculateAngle(lat1, lng1, lat2, lng2);
      setArrowAngle(angle);
      setMessage("Bouh la honte sois t'es pas précise sois tu te souviens plus dans tout les cas c'est la honte !! :))");
    }
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-100 via-rose-100 to-amber-100 flex flex-col items-center justify-center py-10 px-4">
        <div className="text-center space-y-6 max-w-xl font-handwriting text-xl text-pink-800">
          <p>
            Coucou mon amoureuse<br />
            Aujourd'hui c'est ton anniversaire tes 20 ans et malheuresment je suis même pas là<br />
            Du coup pour changer des cadeaux un peu classique et de faire attendre jusqu'à mon retour, je te propose un petit jeu !<br />
            Ton objectif est de te rappeler de nos souvenirs et de retrouver les lieux où ils ont été pris !<br />
            Je te laisse le temps qu'il faut pour trouver chaque lieu, mais je te conseille de ne pas trop traîner je rentre quand même dans un mois pile donc dépeche toi !<br />
          </p>
          <p>
            Aller grosse loutre ! clique sur “Commencer” et bon courage y'en a qui sont pas simple !<br />
            Je t’aime fort, tu me manques, ton amoureux !!
          </p>
          <button
            onClick={() => setStarted(true)}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-pink-600 transition"
          >
            Commencer
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-100 via-rose-100 to-amber-100">
        <h2 className="text-3xl font-bold text-pink-600 mb-4 font-handwriting text-center">
          Joyeux 20 ans mon Chat !
        </h2>
        <p className="text-lg text-pink-800 font-handwriting text-center max-w-xl mb-6">
          Voici quelques souvenirs de notre longue  et belle relation qui représentent chacuns des souvenirs qui comptent le plus à mes yeux !<br />
          Malheuresment j'ai pas tout mit car c'est trop compliqué haha !
        </p>
        <div className="w-full max-w-4xl h-[500px] rounded-xl overflow-hidden shadow-md mx-auto">
          <MapContainer center={[20, 0]} zoom={2} className="w-full h-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {finalMemories.map((place, i) => (
              <Marker
                key={i}
                position={place.coords as [number, number]}
                icon={L.icon({
                  iconUrl: 'pins.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
              >
                <Popup>
                  <strong>{place.label}</strong><br />
                  {place.text}<br />
                  {i === 7 && (
                    <img
                      src="paris.png"
                      alt="Prochain Voyage"
                      className="mt-2 rounded-md shadow w-40 h-auto"
                    />
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-rose-100 to-amber-100 flex flex-col items-center justify-start py-10 px-4">
      <h2 className="text-2xl font-semibold text-pink-700 mb-6 text-center drop-shadow-md font-handwriting">
        Devine où cette photo a été prise ! certaines sont un peu compliqué du coup quand tu cliques tu as une petite aide il faut être bien précis !
      </h2>
      <img
        src={q.image}
        alt="Souvenir"
        className="max-w-2xl rounded-xl shadow-lg mb-6 object-cover h-64 sm:h-80 md:h-96"
      />
      <div className="w-full max-w-4xl h-[400px] relative rounded-xl overflow-hidden shadow-md">
        <MapContainer center={[20, 0]} zoom={2} className="w-full h-full z-0">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GuessMap onGuess={handleGuess} />
          {userGuess && (
            <Marker
              ref={markerRef}
              position={userGuess as [number, number]}
              icon={L.icon({
                iconUrl: 'pins.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup autoPan={false}>
                <div className="flex flex-col items-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: `rotate(${arrowAngle}deg)` }}
                  >
                    <path d="M12 2L15 8H9L12 2Z" fill="#f43f5e" />
                    <path d="M12 22V9" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <p className="mt-2 text-sm text-pink-700 font-semibold">
                    Direction ➜ {Math.round(
                      haversine(userGuess[0], userGuess[1], q.correctCoords[0], q.correctCoords[1])
                    )} km
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      <p className="mt-6 text-lg text-center font-medium text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm">
        {message}
      </p>
    </div>
  );
}