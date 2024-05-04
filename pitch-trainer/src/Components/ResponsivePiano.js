import React from 'react';
import { Piano, KeyboardShortcuts } from 'react-piano';
import SoundfontProvider from '../SoundfontProvider';
import DimensionsProvider from '../DimensionsProvider';
import 'react-piano/dist/styles.css';

const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

function ResponsivePiano({ noteRange, audioContext, onNoteStart, onNoteStop, pianoWidth }) {
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: noteRange.first,
    lastNote: noteRange.last,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  return (
        <SoundfontProvider
          instrumentName="acoustic_grand_piano"
          audioContext={audioContext}
          hostname="https://d1pzp51pvbm36p.cloudfront.net"
          render={({ isLoading, playNote, stopNote }) => {
            return (
              <Piano
                noteRange={noteRange}
                width={pianoWidth}
                playNote={(midiNumber) => {
                  playNote(midiNumber);
                  onNoteStart(midiNumber);
                }}
                stopNote={(midiNumber) => {
                  stopNote(midiNumber);
                  onNoteStop(midiNumber);
                }}
                disabled={isLoading}
                keyboardShortcuts={keyboardShortcuts}
              />
            );
          }}
        />
  );
}

export default ResponsivePiano;