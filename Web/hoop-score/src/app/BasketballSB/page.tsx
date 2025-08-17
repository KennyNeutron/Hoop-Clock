"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HoopClockScoreboard() {
  const [gameTime, setGameTime] = useState(10 * 60 * 10); // 10:00.0 in tenths of seconds
  const [isRunning, setIsRunning] = useState(false);
  const [shotClock, setShotClock] = useState(24 * 10); // 24.0 in tenths of seconds
  const [shotClockRunning, setShotClockRunning] = useState(false);

  // Game state
  const [period, setPeriod] = useState(1);
  const [homeScore, setHomeScore] = useState(0);
  const [guestScore, setGuestScore] = useState(0);
  const [homeFouls, setHomeFouls] = useState(0);
  const [guestFouls, setGuestFouls] = useState(0);
  const [homeTOL, setHomeTOL] = useState(5);
  const [guestTOL, setGuestTOL] = useState(5);

  // Player stats - 5 players each with 2-digit numbers, 1-digit fouls, 2-digit points
  const homePlayers = [
    { number: 0, fouls: 0, points: 0 },
    { number: 0, fouls: 0, points: 0 },
    { number: 0, fouls: 0, points: 0 },
    { number: 0, fouls: 0, points: 0 },
    { number: 0, fouls: 0, points: 0 },
  ];

  const guestPlayers = [
    { number: 0, fouls: 0, points: 0 },
    { number: 0, fouls: 0, points: 0 },
    { number: 0, fouls: 0, points: 0 },
    { number: 0, fouls: 0, points: 0 },
    { number: 0, fouls: 0, points: 0 },
  ];

  // Format time as MM:SS.t (tenths)
  const formatTime = (tenths: number) => {
    const totalSeconds = Math.floor(tenths / 10);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const deciseconds = tenths % 10;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}.${deciseconds}`;
  };

  // Format shot clock as SS.t (tenths)
  const formatShotClock = (tenths: number) => {
    const totalSeconds = Math.floor(tenths / 10);
    const deciseconds = tenths % 10;
    return `${totalSeconds.toString().padStart(2, "0")}.${deciseconds}`;
  };

  // Handle game clock (updates every 100ms for tenths)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && gameTime > 0) {
      interval = setInterval(() => {
        setGameTime((prev) => Math.max(0, prev - 1));
      }, 100); // 100ms intervals for tenths of seconds
    }
    return () => clearInterval(interval);
  }, [isRunning, gameTime]);

  // Handle shot clock (updates every 100ms for tenths)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (shotClockRunning && shotClock > 0) {
      interval = setInterval(() => {
        setShotClock((prev) => Math.max(0, prev - 1));
      }, 100); // 100ms intervals for tenths of seconds
    }
    return () => clearInterval(interval);
  }, [shotClockRunning, shotClock]);

  // Keyboard controls
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key.toLowerCase() === "s") {
      setIsRunning((prev) => !prev);
      setShotClockRunning((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen bg-blue-600 text-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold mb-4">HOOP SCORE BY KENNY NEUTRON</h1>
      </div>

      <div className="grid grid-cols-3 gap-12 max-w-7xl mx-auto">
        {/* Home Team */}
        <div className="text-center">
          <h2 className="text-6xl font-bold mb-8">HOME</h2>

          <div className="grid grid-cols-3 gap-4 text-3xl font-bold mb-6">
            <div>PLYR</div>
            <div>FL</div>
            <div>PTS</div>
          </div>

          {/* Player Stats - 5 rows of black boxes */}
          {homePlayers.map((player, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-4 mb-4">
              {/* Player Number - 2 digits */}
              <div className="bg-black border-2 border-gray-400 h-16 flex items-center justify-center">
                <span className="text-orange-400 text-3xl font-bold font-mono">
                  {player.number.toString().padStart(2, "0")}
                </span>
              </div>
              {/* Fouls - 1 digit */}
              <div className="bg-black border-2 border-gray-400 h-16 flex items-center justify-center">
                <span className="text-green-400 text-3xl font-bold font-mono">
                  {player.fouls}
                </span>
              </div>
              {/* Points - 2 digits */}
              <div className="bg-black border-2 border-gray-400 h-16 flex items-center justify-center">
                <span className="text-orange-400 text-3xl font-bold font-mono">
                  {player.points.toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Center - Game Info */}
        <div className="text-center">
          {/* Game Clock */}
          <div className="bg-black border-4 border-white mb-8 p-6">
            <div className="text-8xl font-bold text-yellow-400 font-mono">
              {formatTime(gameTime)}
            </div>
            <div className="text-sm text-white mt-2">Hoop Score</div>
          </div>

          {/* Scores and Period */}
          <div className="grid grid-cols-3 gap-6 items-center mb-8">
            <div>
              <div className="text-3xl font-bold underline mb-4">SCORE</div>
              <div className="bg-black border-4 border-white h-24 flex items-center justify-center">
                <span className="text-orange-400 text-6xl font-bold font-mono">
                  {homeScore}
                </span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold underline mb-4">PERIOD</div>
              <div className="bg-black border-4 border-white h-24 flex items-center justify-center">
                <span className="text-green-400 text-6xl font-bold font-mono">
                  {period}
                </span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold underline mb-4">SCORE</div>
              <div className="bg-black border-4 border-white h-24 flex items-center justify-center">
                <span className="text-orange-400 text-6xl font-bold font-mono">
                  {guestScore}
                </span>
              </div>
            </div>
          </div>

          {/* Shot Clock */}
          <div className="mb-8">
            <div className="text-3xl font-bold underline mb-4">SHOT CLOCK</div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                className="bg-gray-600 text-white px-4 py-2"
              >
                <span className="text-xl">◀ B B</span>
              </Button>
              <div className="bg-black border-4 border-white h-20 w-32 flex items-center justify-center">
                <span className="text-red-400 text-5xl font-bold font-mono">
                  {formatShotClock(shotClock)}
                </span>
              </div>
              <Button
                variant="secondary"
                className="bg-gray-600 text-white px-4 py-2"
              >
                <span className="text-xl">B B ▶</span>
              </Button>
            </div>
          </div>

          {/* Fouls and Timeouts */}
          <div className="grid grid-cols-4 gap-6 items-center">
            <div>
              <div className="text-2xl font-bold underline mb-4">FOULS</div>
              <div className="bg-black border-4 border-white h-16 flex items-center justify-center">
                <span className="text-green-400 text-4xl font-bold font-mono">
                  {homeFouls}
                </span>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold underline mb-4">T.O.L.</div>
              <div className="bg-black border-4 border-white h-16 flex items-center justify-center">
                <span className="text-green-400 text-4xl font-bold font-mono">
                  {homeTOL}
                </span>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold underline mb-4">T.O.L.</div>
              <div className="bg-black border-4 border-white h-16 flex items-center justify-center">
                <span className="text-green-400 text-4xl font-bold font-mono">
                  {guestTOL}
                </span>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold underline mb-4">FOULS</div>
              <div className="bg-black border-4 border-white h-16 flex items-center justify-center">
                <span className="text-green-400 text-4xl font-bold font-mono">
                  {guestFouls}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Team */}
        <div className="text-center">
          <h2 className="text-6xl font-bold mb-8">GUEST</h2>

          <div className="grid grid-cols-3 gap-4 text-3xl font-bold mb-6">
            <div>PLYR</div>
            <div>FL</div>
            <div>PTS</div>
          </div>

          {/* Player Stats - 5 rows of black boxes */}
          {guestPlayers.map((player, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-4 mb-4">
              {/* Player Number - 2 digits */}
              <div className="bg-black border-2 border-gray-400 h-16 flex items-center justify-center">
                <span className="text-orange-400 text-3xl font-bold font-mono">
                  {player.number.toString().padStart(2, "0")}
                </span>
              </div>
              {/* Fouls - 1 digit */}
              <div className="bg-black border-2 border-gray-400 h-16 flex items-center justify-center">
                <span className="text-green-400 text-3xl font-bold font-mono">
                  {player.fouls}
                </span>
              </div>
              {/* Points - 2 digits */}
              <div className="bg-black border-2 border-gray-400 h-16 flex items-center justify-center">
                <span className="text-orange-400 text-3xl font-bold font-mono">
                  {player.points.toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="fixed bottom-4 left-4 bg-black/70 px-4 py-2 rounded text-sm">
        Press 'S' to start/stop clock
      </div>
    </div>
  );
}
