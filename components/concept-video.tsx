"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";

const RATES = [1, 1.25, 1.5, 2];

function formatTime(total: number) {
  if (!Number.isFinite(total) || total < 0) return "0:00";
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatRate(rate: number) {
  return `${Number.isInteger(rate) ? rate : rate.toFixed(2).replace(/0$/, "")}×`;
}

export function ConceptVideo({
  src,
  poster,
  label,
  autoPlay = false,
}: {
  src: string;
  poster: string;
  label: string;
  autoPlay?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const flashTimer = useRef<number | null>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [notice, setNotice] = useState("");
  const [flash, setFlash] = useState<"play" | "pause" | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onTime = () => setCurrent(el.currentTime);
    const onMeta = () => {
      setDuration(el.duration || 0);
      setMuted(el.muted);
    };
    const onPlayEvent = () => {
      setPlaying(true);
      setStarted(true);
      setEnded(false);
      setNotice("");
    };
    const onPauseEvent = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setEnded(true);
    };
    const onProgress = () => {
      try {
        if (el.buffered.length > 0) setBuffered(el.buffered.end(el.buffered.length - 1));
      } catch {
        /* buffered info unavailable */
      }
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("play", onPlayEvent);
    el.addEventListener("pause", onPauseEvent);
    el.addEventListener("ended", onEnded);
    el.addEventListener("progress", onProgress);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("play", onPlayEvent);
      el.removeEventListener("pause", onPauseEvent);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("progress", onProgress);
    };
  }, []);

  // Autoplay with sound when the modal opens; fall back to muted when blocked.
  useEffect(() => {
    if (!autoPlay) return;
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.play()
      .then(() => setMuted(false))
      .catch(() => {
        el.muted = true;
        setMuted(true);
        el.play()
          .then(() => setNotice("Playing muted — use the sound button for audio."))
          .catch(() => setNotice("Press play to watch."));
      });
  }, [autoPlay]);

  useEffect(
    () => () => {
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
    },
    []
  );

  function showFlash(kind: "play" | "pause") {
    setFlash(kind);
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setFlash(null), 450);
  }

  async function playWithSound(el: HTMLVideoElement) {
    try {
      if (el.muted) {
        el.muted = false;
        setMuted(false);
      }
      await el.play();
    } catch {
      el.muted = true;
      setMuted(true);
      try {
        await el.play();
        setNotice("Playing muted — use the sound button for audio.");
      } catch {
        setNotice("Press play to watch.");
      }
    }
  }

  async function togglePlay() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      if (el.ended) {
        try {
          el.currentTime = 0;
        } catch {
          /* seek unavailable */
        }
        setEnded(false);
      }
      showFlash("play");
      await playWithSound(el);
    } else {
      showFlash("pause");
      el.pause();
    }
  }

  function toggleMute() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    setNotice("");
    if (!el.muted && el.paused && started) void playWithSound(el);
  }

  function cycleRate() {
    const el = videoRef.current;
    const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    setRate(next);
    if (el) {
      try {
        el.playbackRate = next;
      } catch {
        /* rate unsupported */
      }
    }
  }

  function nudge(seconds: number) {
    const el = videoRef.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = Math.min(Math.max(0, el.currentTime + seconds), el.duration || 0);
  }

  function seekFromPointer(clientX: number) {
    const bar = barRef.current;
    const el = videoRef.current;
    if (!bar || !el || !Number.isFinite(el.duration) || el.duration <= 0) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    el.currentTime = ratio * el.duration;
    setCurrent(el.currentTime);
  }

  function fullscreen() {
    const el = videoRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    // iOS Safari prefers webkit presentation on the video element.
    const anyEl = el as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
    };
    if (typeof anyEl.webkitEnterFullscreen === "function" && !document.fullscreenEnabled) {
      anyEl.webkitEnterFullscreen();
      return;
    }
    el.requestFullscreen?.().catch(() => setNotice("Fullscreen is not available here."));
  }

  const progress = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;
  const bufferedPct = duration > 0 ? Math.min(100, (buffered / duration) * 100) : 0;

  return (
    <div
      className="custom-player"
      data-playing={playing}
      tabIndex={0}
      role="group"
      aria-label={`${label} video player`}
      onKeyDown={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        if ((target.tagName === "BUTTON" || target.tagName === "A") && (e.key === " " || e.key === "Enter")) return;
        if (target.closest?.(".custom-player-progress")) return;
        const key = e.key.toLowerCase();
        if (e.key === " " || key === "k") {
          e.preventDefault();
          void togglePlay();
        } else if (key === "m") {
          toggleMute();
        } else if (key === "f") {
          fullscreen();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          nudge(5);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          nudge(-5);
        }
      }}
    >
      <video
        ref={videoRef}
        className="custom-player-media"
        playsInline
        preload="metadata"
        poster={poster}
        src={src}
        aria-label={label}
        onClick={() => void togglePlay()}
        onDoubleClick={fullscreen}
      />
      {/* The single play affordance */}
      {!playing && (
        <button
          type="button"
          className="custom-player-center"
          onClick={() => void togglePlay()}
          aria-label={ended ? `Replay ${label}` : `Play ${label}`}
        >
          {ended ? <RotateCcw size={26} /> : <Play size={26} fill="currentColor" />}
        </button>
      )}
      {flash && (
        <div className="custom-player-flash" aria-hidden="true">
          <span>
            {flash === "play" ? <Play size={26} fill="currentColor" /> : <Pause size={26} fill="currentColor" />}
          </span>
        </div>
      )}

      {/* Controls appear once playback starts — no second play button. */}
      {started && (
        <div className="custom-player-bar">
          <div
            ref={barRef}
            className="custom-player-progress"
            role="slider"
            tabIndex={0}
            aria-label={`Seek ${label}`}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration || 0)}
            aria-valuenow={Math.round(current)}
            aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
            onClick={(e) => seekFromPointer(e.clientX)}
            onKeyDown={(e) => {
              e.stopPropagation();
              const el = videoRef.current;
              if (!el) return;
              if (e.key === "ArrowRight") nudge(5);
              if (e.key === "ArrowLeft") nudge(-5);
              if (e.key === "Home") el.currentTime = 0;
              if (e.key === "End" && Number.isFinite(el.duration)) el.currentTime = el.duration;
            }}
          >
            <span className="custom-player-progress-track">
              <span className="custom-player-progress-buffered" style={{ width: `${bufferedPct}%` }} />
              <span className="custom-player-progress-fill" style={{ width: `${progress}%` }} />
            </span>
          </div>
          <div className="custom-player-controls">
            <span className="custom-player-time">
              {formatTime(current)} / {formatTime(duration)}
            </span>
            <span className="custom-player-spacer" />
            <button
              type="button"
              className="custom-player-rate"
              onClick={cycleRate}
              aria-label={`Playback speed ${formatRate(rate)}. Activate to change speed.`}
            >
              {formatRate(rate)}
            </button>
            <button type="button" onClick={toggleMute} aria-label={muted ? `Unmute ${label}` : `Mute ${label}`}>
              {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
            <button type="button" onClick={fullscreen} aria-label={`Fullscreen ${label}`}>
              <Maximize size={16} />
            </button>
          </div>
        </div>
      )}
      {notice && (
        <p className="custom-player-notice" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}
