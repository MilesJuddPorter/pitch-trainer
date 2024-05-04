import React, { useState, useEffect } from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import Soundfont from 'soundfont-player';
import 'react-piano/dist/styles.css';
import './App.css';

import ResponsivePiano from './Components/ResponsivePiano'
import SoundfontProvider from './SoundfontProvider';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const noteRange = {
  first: MidiNumbers.fromNote('c4'),
  last: MidiNumbers.fromNote('c5'),
};


function NoteRangeSelector({ label, onChange, value }) {
  const noteName = MidiNumbers.getAttributes(value).note;
  return (
    <div>
      <label>{label}: {noteName}</label>
      <input
        type="range"
        min={MidiNumbers.fromNote('c4')}
        max={MidiNumbers.fromNote('c5')}
        value={value}
        onChange={e => onChange(parseInt(e.target.value, 10))}
      />
    </div>
  );
}

const noteColorMap = {
  'C': '#FFCCCC', // Red
  'Db': '#FFB399', // Orange
  'D': '#FFCC99', // Yellow
  'Eb': '#FFD699', // Green
  'E': '#FFFF99', // Blue
  'F': '#CCFF99', // Indigo
  'Gb': '#99FF99', // Dark violet
  'G': '#99FFFF', // Deep pink
  'Ab': '#99CCFF', // Deep sky blue
  'A': '#9999FF', // Gold
  'Bb': '#CC99FF', // Tomato
  'B': '#FF99CC'  // Violet
};



function App() {
  const [instrument, setInstrument] = useState(null);
  const [activeAudioNodes, setActiveAudioNodes] = useState({});
  const [randomNote, setRandomNote] = useState(null);
  const [userNote, setUserNote] = useState(null);
  const [streak, setStreak] = useState(0);
  const [pianoWidth, setPianoWidth] = useState(window.innerWidth - 200); 
  const [firstRandom, setFirstRandom] = useState(MidiNumbers.fromNote('c4'));
  const [lastRandom, setLastRandom] = useState(MidiNumbers.fromNote('c5'));
  const [sequenceLength, setSequenceLength] = useState(1);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF'); // Default background color


  useEffect(() => {
    function handleResize() {
      setPianoWidth(window.innerWidth - 200);
      console.log(pianoWidth)
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    loadInstrument('acoustic_grand_piano');

    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        console.log("Space Pressed")
        setRandomNote(null)
        setUserNote(null)
        playRandomNote();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [instrument]);

  const loadInstrument = (instrumentName) => {
    Soundfont.instrument(audioContext, instrumentName, {
      format: 'mp3',
      soundfont: 'MusyngKite'
    }).then(loadedInstrument => {
      setInstrument(loadedInstrument);
    });
  };

  const playNote = (midiNumber) => {
    Soundfont.instrument(new AudioContext(), 'acoustic_grand_piano').then(function (piano) {
      piano.play(midiNumber)
    })
  };

  const playRandomNote = () => {
    if (!instrument) return;

    const midiNumber = Math.floor(Math.random() * (lastRandom - firstRandom + 1)) + firstRandom; // Random MIDI number between 60 (C4) and 72 (C5)
    const midiNote = MidiNumbers.getAttributes(midiNumber).note
    playNote(midiNote);
    console.log(midiNote)
    setRandomNote(midiNote)
    return midiNumber
  };

  const handleNoteStart = (midiNumber) => {
    const midiNoteName = MidiNumbers.getAttributes(midiNumber).note
    console.log("Note started:", midiNoteName);
    const color = noteColorMap[MidiNumbers.getAttributes(midiNumber).note.slice(0, -1)] || '#FFFFFF';
    setBackgroundColor(color);
    if (!userNote && randomNote) {
      setUserNote(midiNoteName);
      if (midiNoteName === randomNote) {
        setStreak(streak + 1);
      } else {
        setStreak(0);
      }
    }
  };

  const handleNoteStop = (midiNumber) => {
    const midiNoteName = MidiNumbers.getAttributes(midiNumber).note
    console.log("Note stopped:", midiNoteName);
  };

  return (
    <div className="main">
      <div className='settings'>
        <h1>Settings:</h1>
        <NoteRangeSelector
          label="Lower Range"
          value={firstRandom}
          onChange={setFirstRandom}
        />
        <NoteRangeSelector
          label="Upper Range"
          value={lastRandom}
          onChange={setLastRandom}
        />
      </div>
      <div className='center' style={{ backgroundColor: backgroundColor }}>
        <h1 className='title'>Pitch Trainer!</h1>
        <h2>Streak: {streak}</h2>
        <div id="piano-holder">
          <ResponsivePiano
            noteRange={{ first: firstRandom, last: lastRandom }}
            audioContext={audioContext}
            onNoteStart={handleNoteStart}
            onNoteStop={handleNoteStop}
            width={pianoWidth}
          />
        </div>
        <div>
          {randomNote && userNote ? (
            <>
              Random Note: {randomNote}
              <br />
              Your Note: {userNote}
            </>
          ) : (
            'Press space to play a random note and respond with a key press.'
          )}
        </div>
      </div>
    </div>
  );
}

export default App