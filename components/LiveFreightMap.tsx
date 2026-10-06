'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  TruckTelemetry,
  WeatherCheckpoint,
  ReturnLoadOffer,
} from '@/lib/freight-data';
import {
  CloudRain,
  AlertTriangle,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  Receipt,
} from 'lucide-react';

const MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  'AIzaSyDx7fdX83xPZ-TKAstqS29JMbenJkxuU0I';

interface LiveFreightMapProps {
  truck: TruckTelemetry;
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  onProgressChange: (newProgress: number) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  priorityReturnLoad?: ReturnLoadOffer;
  onOpenReturnLoadModal: () => void;
  onOpenBillModal: () => void;
  encodedPolylines?: Record<string, string>;
}

declare global {
  interface Window {
    google?: any;
  }
}

function loadGoogleMapsBootstrap(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.maps?.importLibrary) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById('gmp-bootstrap-loader');
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.importLibrary) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = 'gmp-bootstrap-loader';
    script.innerHTML = `
      (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=\`https://maps.\${c}apis.com/maps/api/js?\`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
        key: "${apiKey}",
        v: "weekly"
      });
    `;
    document.head.appendChild(script);

    const poll = setInterval(() => {
      if (window.google?.maps?.importLibrary) {
        clearInterval(poll);
        resolve();
      }
    }, 80);

    setTimeout(() => {
      clearInterval(poll);
      if (!window.google?.maps?.importLibrary) {
        reject(new Error('Google Maps JS API timed out'));
      }
    }, 10000);
  });
}

export default function LiveFreightMap({
  truck,
  selectedRouteId,
  onSelectRoute,
  onProgressChange,
  isSimulating,
  onToggleSimulation,
  priorityReturnLoad,
  onOpenReturnLoadModal,
  onOpenBillModal,
  encodedPolylines = {},
}: LiveFreightMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const polylinesRef = useRef<any[]>([]);
  const markersRef = useRef<any[]>([]);
  const truckMarkerRef = useRef<any>(null);

  const [mapReady, setMapReady] = useState(false);
  const [selectedCheckpoint, setSelectedCheckpoint] =
    useState<WeatherCheckpoint | null>(null);
  const [showWeatherPins, setShowWeatherPins] = useState(true);

  const activeRoute =
    truck.routes.find((r) => r.id === selectedRouteId) || truck.routes[0];

  useEffect(() => {
    let mounted = true;
    loadGoogleMapsBootstrap(MAPS_API_KEY)
      .then(async () => {
        if (!mounted || !mapContainerRef.current) return;
        const { Map } = await window.google.maps.importLibrary('maps');
        await window.google.maps.importLibrary('marker');
        await window.google.maps.importLibrary('geometry');

        if (!mapInstanceRef.current && mapContainerRef.current) {
          mapInstanceRef.current = new Map(mapContainerRef.current, {
            center: truck.currentCoords,
            zoom: 6,
            mapId: 'DEMO_MAP_ID',
            disableDefaultUI: true,
            zoomControl: false,
            gestureHandling: 'greedy',
          });
          setMapReady(true);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !window.google?.maps) return;

    const map = mapInstanceRef.current;
    const { Polyline, LatLngBounds } = window.google.maps;
    const { AdvancedMarkerElement } = window.google.maps.marker || {};

    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    markersRef.current.forEach((m) => {
      m.map = null;
    });
    markersRef.current = [];

    const bounds = new LatLngBounds();
    bounds.extend(truck.originCoords);
    bounds.extend(truck.destinationCoords);

    truck.routes.forEach((route) => {
      const isSelected = route.id === activeRoute.id;
      const isHazardRoute =
        route.type === 'SHORTEST_DIRECT' && !route.recommended;

      let pathPoints = route.waypoints;
      const encoded = encodedPolylines[route.id] || route.encodedPolyline;
      if (encoded && window.google?.maps?.geometry?.encoding) {
        try {
          const decoded =
            window.google.maps.geometry.encoding.decodePath(encoded);
          if (decoded && decoded.length > 1) {
            pathPoints = decoded;
          }
        } catch {}
      }

      pathPoints.forEach((pt: any) => bounds.extend(pt));

      if (isSelected) {
        const casing = new Polyline({
          path: pathPoints,
          geodesic: true,
          strokeColor: '#0F172A',
          strokeOpacity: 0.75,
          strokeWeight: 6,
          zIndex: 10,
          map,
        });
        polylinesRef.current.push(casing);
      }

      const mainLine = new Polyline({
        path: pathPoints,
        geodesic: true,
        strokeColor: isHazardRoute
          ? '#DC2626'
          : isSelected
          ? '#0F766E'
          : '#94A3B8',
        strokeOpacity: isSelected ? 0.95 : 0.55,
        strokeWeight: isSelected ? 4 : 3,
        zIndex: isSelected ? 15 : 5,
        map,
      });

      mainLine.addListener('click', () => {
        onSelectRoute(route.id);
      });

      polylinesRef.current.push(mainLine);
    });

    if (AdvancedMarkerElement) {
      const originEl = document.createElement('div');
      originEl.className =
        'px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-semibold shadow-sm flex items-center gap-1 whitespace-nowrap';
      originEl.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span><span>${truck.originCity}</span>`;
      const originMarker = new AdvancedMarkerElement({
        map,
        position: truck.originCoords,
        content: originEl,
        title: `Origin: ${truck.originCity}`,
      });
      markersRef.current.push(originMarker);

      const destEl = document.createElement('div');
      destEl.className =
        'px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-semibold shadow-md border border-teal-400 flex items-center gap-1 cursor-pointer whitespace-nowrap';
      destEl.innerHTML = `
        <span class="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
        <span>${truck.destinationCity}</span>
      `;
      destEl.addEventListener('click', () => {
        onOpenReturnLoadModal();
      });
      const destMarker = new AdvancedMarkerElement({
        map,
        position: truck.destinationCoords,
        content: destEl,
        title: `Destination: ${truck.destinationCity}`,
      });
      markersRef.current.push(destMarker);

      if (showWeatherPins) {
        const allCheckpoints = truck.routes.flatMap((r) => r.checkpoints);
        const seenIds = new Set<string>();
        allCheckpoints.forEach((cp) => {
          if (seenIds.has(cp.id)) return;
          seenIds.add(cp.id);

          const isCritical =
            cp.floodRisk === 'CRITICAL' || cp.floodRisk === 'HIGH';
          const cpEl = document.createElement('div');
          cpEl.className = `px-2 py-0.5 rounded-full text-[10px] font-medium shadow-xs border cursor-pointer flex items-center gap-1 whitespace-nowrap ${
            isCritical
              ? 'bg-red-600 text-white border-red-700 font-semibold'
              : 'bg-white/95 text-slate-800 border-slate-200'
          }`;
          cpEl.innerHTML = `
            <span>${isCritical ? '⚠️' : '☁️'} ${cp.name.split(' ')[0]}</span>
            <span class="font-mono">${cp.tempC}°C</span>
          `;
          cpEl.addEventListener('click', () => {
            setSelectedCheckpoint(cp);
          });

          const cpMarker = new AdvancedMarkerElement({
            map,
            position: { lat: cp.lat, lng: cp.lng },
            content: cpEl,
            title: `${cp.name} (${cp.condition})`,
          });
          markersRef.current.push(cpMarker);
        });
      }
    }

    map.fitBounds(bounds, { top: 48, right: 24, bottom: 48, left: 24 });
  }, [
    mapReady,
    truck.id,
    activeRoute.id,
    showWeatherPins,
    encodedPolylines,
    priorityReturnLoad,
  ]);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !window.google?.maps?.marker)
      return;

    const map = mapInstanceRef.current;
    const { AdvancedMarkerElement } = window.google.maps.marker;

    if (truckMarkerRef.current) {
      truckMarkerRef.current.map = null;
    }

    const isStaying = truck.status === 'STAYING_AT_HALT' && truck.speedKmh === 0;
    const isCompleted = truck.progressPercent >= 100;

    const truckEl = document.createElement('div');
    truckEl.className = 'relative flex flex-col items-center cursor-pointer';
    truckEl.innerHTML = `
      <div class="px-2.5 py-1 rounded-full shadow-md border ${
        isCompleted
          ? 'bg-teal-700 text-white border-white'
          : isStaying
          ? 'bg-amber-100 text-slate-900 border-amber-400'
          : 'bg-slate-900 text-white border-teal-400'
      } text-[10px] font-semibold flex items-center gap-1 whitespace-nowrap">
        <span>🚛 ${truck.vehicleNumber}</span>
      </div>
    `;

    truckMarkerRef.current = new AdvancedMarkerElement({
      map,
      position: truck.currentCoords,
      content: truckEl,
      zIndex: 100,
      title: `${truck.vehicleNumber} (${truck.transporterName})`,
    });
  }, [
    mapReady,
    truck.currentCoords.lat,
    truck.currentCoords.lng,
    truck.status,
    truck.speedKmh,
    truck.progressPercent,
    truck.vehicleNumber,
    truck.transporterName,
  ]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-100 shadow-xs flex flex-col">
      {/* Top Floating Mobile Route Pills */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-1.5 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-xs">
          {truck.routes.map((r) => {
            const active = r.id === activeRoute.id;
            const isSafe = r.type === 'WEATHER_SAFE';
            return (
              <button
                key={r.id}
                onClick={() => onSelectRoute(r.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  active
                    ? isSafe
                      ? 'bg-teal-700 text-white'
                      : 'bg-red-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {isSafe ? (
                  <ShieldCheck className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                <span>{isSafe ? 'Safe Route' : 'Shortest'}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowWeatherPins((v) => !v)}
          className="pointer-events-auto min-h-[36px] px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-white/95 backdrop-blur-md text-slate-700 border border-slate-200 shadow-xs flex items-center gap-1 cursor-pointer"
        >
          <CloudRain className="w-3.5 h-3.5 text-teal-700" />
          <span>{showWeatherPins ? 'Weather On' : 'Weather Off'}</span>
        </button>
      </div>

      {/* Selected Weather Checkpoint Mobile Popover */}
      {selectedCheckpoint && (
        <div className="absolute bottom-24 left-3 right-3 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3.5 shadow-lg">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-teal-800">
                {selectedCheckpoint.floodRisk} FLOOD RISK · {selectedCheckpoint.highway}
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                {selectedCheckpoint.name} ({selectedCheckpoint.tempC}°C · {selectedCheckpoint.precipProb}% Rain)
              </h4>
            </div>
            <button
              onClick={() => setSelectedCheckpoint(null)}
              className="text-xs text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            {selectedCheckpoint.roadAdvisory}
          </p>
        </div>
      )}

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-[260px]" />

      {/* Mobile Touch Controls Bar */}
      <div className="bg-white border-t border-slate-100 p-3 space-y-2.5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-slate-700 w-10">
            {truck.progressPercent}%
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={truck.progressPercent}
            onChange={(e) => onProgressChange(Number(e.target.value))}
            className="flex-1 accent-teal-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
          {truck.progressPercent !== 48 && (
            <button
              onClick={() => onProgressChange(48)}
              title="Reset to Halt"
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onToggleSimulation}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] transition-transform"
          >
            {isSimulating ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Trip</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Simulate GPS</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onProgressChange(100);
              onOpenBillModal();
            }}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <Receipt className="w-4 h-4" />
            <span>Complete & Bill</span>
          </button>
        </div>
      </div>
    </div>
  );
}
