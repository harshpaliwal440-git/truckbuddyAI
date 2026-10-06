'use client';

import React, { useState, useEffect } from 'react';
import {
  TruckTelemetry,
  DriverOption,
  RAGDocument,
  INITIAL_RAG_DOCUMENTS,
} from '@/lib/freight-data';
import {
  Star,
  Sparkles,
  BookOpen,
  Search,
  CheckCircle2,
  Building2,
  Plus,
  FileText,
  UserCheck,
} from 'lucide-react';

interface RAGAndDriverAdvisorProps {
  truck: TruckTelemetry;
  drivers: DriverOption[];
  selectedDriverId: string;
  onSelectDriver: (driver: DriverOption) => void;
  onRateDriver: (driverId: string, stars: number) => void;
  mode?: 'BOTH' | 'DRIVERS_ONLY' | 'RAG_ONLY';
}

export default function RAGAndDriverAdvisor({
  truck,
  drivers,
  selectedDriverId,
  onSelectDriver,
  onRateDriver,
  mode = 'BOTH',
}: RAGAndDriverAdvisorProps) {
  const [ragDocs, setRagDocs] = useState<RAGDocument[]>(INITIAL_RAG_DOCUMENTS);
  const [query, setQuery] = useState(
    `Best flood-free route and highest rated driver for ${truck.originCity} to ${truck.destinationCity}`
  );
  const [loadingRag, setLoadingRag] = useState(false);
  const [ragResult, setRagResult] = useState<{
    answer: string;
    keyTakeaways: string[];
    retrievedChunks: Array<RAGDocument & { score: number }>;
  } | null>(null);

  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [ratingSuccessId, setRatingSuccessId] = useState<string | null>(null);

  useEffect(() => {
    const defaultQ = `Best flood-free route and highest rated driver for ${truck.originCity} to ${truck.destinationCity}`;
    setQuery(defaultQ);
    runRagQuery(defaultQ, ragDocs);
  }, [truck.id]);

  async function runRagQuery(qText: string, docsToUse = ragDocs) {
    setLoadingRag(true);
    try {
      const res = await fetch('/api/ai/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: qText,
          documents: docsToUse,
          truck,
          drivers,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setRagResult(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingRag(false);
    }
  }

  function handleAddCustomDoc(e: React.FormEvent) {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocContent.trim()) return;
    const customDoc: RAGDocument = {
      id: `rag-custom-${Date.now()}`,
      code: `DOC-CUSTOM-${ragDocs.length + 1}`,
      title: newDocTitle.trim(),
      category: 'CORRIDOR_WEATHER',
      corridor: `${truck.originCity} ⇄ ${truck.destinationCity}`,
      updatedAt: 'Just now',
      content: newDocContent.trim(),
      keywords: newDocTitle
        .toLowerCase()
        .split(/\s+/)
        .concat(newDocContent.toLowerCase().split(/\s+/).slice(0, 8)),
    };
    const updated = [customDoc, ...ragDocs];
    setRagDocs(updated);
    setNewDocTitle('');
    setNewDocContent('');
    setShowAddDoc(false);
    runRagQuery(newDocTitle, updated);
  }

  const sortedDrivers = [...drivers].sort((a, b) => b.rating - a.rating);

  return (
    <div className="space-y-4">
      {/* AI Customer-Rated Driver Selector */}
      {(mode === 'BOTH' || mode === 'DRIVERS_ONLY') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-teal-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Select Driver by Customer Rating
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">
              Active: <strong className="text-slate-800">{truck.driverName}</strong>
            </span>
          </div>

          <div className="space-y-3">
            {sortedDrivers.map((drv) => {
              const isSelected =
                drv.id === selectedDriverId || drv.name === truck.driverName;
              return (
                <div
                  key={drv.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isSelected
                      ? 'bg-white border-2 border-teal-700 shadow-xs'
                      : 'bg-white border-slate-200/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-semibold mb-1">
                        {drv.aiBadge}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {drv.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-slate-600 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span className="font-medium text-slate-800">
                          {drv.transporterName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {drv.rating.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        ({drv.totalReviews})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-600 bg-slate-50 px-3 py-2 rounded-xl">
                    <span>{drv.completedTrips} Trips</span>
                    <span>·</span>
                    <span>{drv.experienceYears} Yrs Exp</span>
                    <span>·</span>
                    <span className="text-teal-700 font-semibold">
                      {drv.monsoonSafetyScore}% Safe
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 italic">
                    “{drv.recentCustomerReview}” — {drv.reviewerCompany}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-400 mr-1">
                        Rate:
                      </span>
                      {[4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          onClick={() => {
                            onRateDriver(drv.id, starVal);
                            setRatingSuccessId(drv.id);
                            setTimeout(() => setRatingSuccessId(null), 1800);
                          }}
                          className="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-xs font-mono font-semibold text-slate-700 cursor-pointer"
                        >
                          {starVal}★
                        </button>
                      ))}
                      {ratingSuccessId === drv.id && (
                        <span className="text-[11px] text-teal-700 font-semibold ml-1">
                          Rated!
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectDriver(drv)}
                      className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold transition-transform active:scale-[0.98] cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <span>Select Driver</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RAG (Retrieval-Augmented Generation) Assistant Card */}
      {(mode === 'BOTH' || mode === 'RAG_ONLY') && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono text-[10px] font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-teal-700" />
              <span>RAG ROUTE & POLICY AI ({ragDocs.length} DOCS)</span>
            </span>
            <button
              onClick={() => setShowAddDoc((v) => !v)}
              className="text-xs font-semibold text-teal-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddDoc ? 'Close' : 'Add Doc'}</span>
            </button>
          </div>

          {showAddDoc && (
            <form
              onSubmit={handleAddCustomDoc}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
            >
              <input
                type="text"
                placeholder="Doc Title (e.g., Highway Toll Rule)"
                value={newDocTitle}
                onChange={(e) => setNewDocTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              />
              <textarea
                placeholder="Enter knowledge note to index..."
                value={newDocContent}
                onChange={(e) => setNewDocContent(e.target.value)}
                rows={2}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              />
              <button
                type="submit"
                className="w-full min-h-[40px] rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Save & Index in RAG
              </button>
            </form>
          )}

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask RAG about routes, floods, bills..."
                className="w-full h-11 pl-8 pr-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>
            <button
              onClick={() => runRagQuery(query)}
              disabled={loadingRag}
              className="h-11 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer shrink-0 disabled:opacity-60"
            >
              {loadingRag ? '...' : 'Ask'}
            </button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              'Flood-safe route?',
              'Top rated driver?',
              'Razorpay & 2 free rides?',
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setQuery(preset);
                  runRagQuery(preset);
                }}
                className="px-3 py-1.5 rounded-full bg-slate-100 text-[11px] text-slate-700 font-medium whitespace-nowrap cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-[10px] font-mono uppercase text-teal-800 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>RAG GROUNDED ANSWER</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed">
              {ragResult?.answer ||
                'Retrieving highway weather advisories and driver ratings...'}
            </p>
          </div>

          <div className="space-y-1.5">
            {(ragResult?.retrievedChunks || ragDocs.slice(0, 2)).map(
              (chunk: any) => (
                <div
                  key={chunk.id}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span className="font-mono text-[10px] font-bold text-teal-800">
                      {chunk.code}
                    </span>
                    <span className="text-xs text-slate-700 truncate">
                      {chunk.title}
                    </span>
                  </div>
                  {chunk.score && (
                    <span className="font-mono text-[10px] font-semibold text-slate-500 shrink-0">
                      {chunk.score}%
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
