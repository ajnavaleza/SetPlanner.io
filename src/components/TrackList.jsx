import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

/**
 * Parse a Camelot key string (e.g. "7A", "10B") into { num, letter }.
 */
function parseCamelot(camelotKey) {
  if (!camelotKey) return { num: 0, letter: '' };
  const letter = camelotKey.slice(-1).toUpperCase(); // 'A' or 'B'
  const num = parseInt(camelotKey.slice(0, -1), 10) || 0;
  return { num, letter };
}

/**
 * isCompatible: If the numeric distance (circular, wrapping at 12) between two keys is in [1..3],
 * they’re considered compatible (e.g., "7A" can go to "4A/B", "5A/B", "6A/B", "8A/B", "9A/B", "10A/B").
 */
function isCompatible(songA, songB) {
  if (!songA.key || !songB.key) return false;
  const { num: aNum } = parseCamelot(songA.key);
  const { num: bNum } = parseCamelot(songB.key);

  let diff = Math.abs(aNum - bNum);
  diff = Math.min(diff, 12 - diff); // wrap around at 12

  return diff >= 1 && diff <= 3;
}

/** Reorder tracks after a manual drag operation. */
function reorderDrag(list, startIndex, endIndex) {
  const arr = Array.from(list);
  const [removed] = arr.splice(startIndex, 1);
  arr.splice(endIndex, 0, removed);
  return arr;
}

/** 
 * Try to find the longest chain of tracks where consecutive pairs are compatible.
 * We'll do a simple backtracking approach, storing the best chain we can find.
 */
function findMaxChain(tracks) {
  const n = tracks.length;
  const used = new Array(n).fill(false);
  let bestChain = [];

  function backtrack(path) {
    // If path is longer than bestChain, replace bestChain
    if (path.length > bestChain.length) {
      bestChain = [...path];
    }
    for (let i = 0; i < n; i++) {
      if (!used[i]) {
        if (path.length === 0 || isCompatible(path[path.length - 1], tracks[i])) {
          used[i] = true;
          path.push(tracks[i]);

          backtrack(path);

          path.pop();
          used[i] = false;
        }
      }
    }
  }

  backtrack([]);
  return bestChain;
}

/**
 * autoSortTracks:
 * 1) Find the biggest chain of compatible tracks.
 * 2) Put that chain on top, leftover tracks on bottom.
 */
function autoSortTracks(tracks) {
  if (tracks.length <= 1) return tracks;
  const maxChain = findMaxChain(tracks);

  if (maxChain.length === tracks.length) {
    // Perfect chain includes all tracks
    return maxChain;
  } else {
    // Some leftover tracks
    const chainSet = new Set(maxChain);
    const leftovers = tracks.filter(t => !chainSet.has(t));
    return [...maxChain, ...leftovers];
  }
}

/** 
 * Compute total length of all tracks, convert to "MM:SS" string.
 * We assume each track has a .length in seconds.
 */
function getTotalSetTime(tracks) {
  const totalSec = tracks.reduce((acc, t) => acc + (t.length || 0), 0);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  // zero-pad seconds
  const secStr = sec.toString().padStart(2, '0');
  return `${min}:${secStr}`;
}

/** 
 * The main TrackList component; includes:
 * - "Estimated Set Time" at the top
 * - "Auto Sort by Key" button
 * - Draggable list of tracks
 */
export default function TrackList({ tracks, setTracks }) {
  // Called after manual drag
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newOrder = reorderDrag(tracks, result.source.index, result.destination.index);
    setTracks(newOrder);
  };

  // Called on "Auto Sort by Key" click
  const handleAutoSort = () => {
    if (tracks.length < 2) return;
    const newOrder = autoSortTracks(tracks);
    setTracks(newOrder);
  };

  const estTime = getTotalSetTime(tracks);

  return (
    <div>
      <h2>Track List</h2>
      <p><strong>Estimated Set Time:</strong> {estTime}</p>

      {tracks.length > 1 && (
        <button onClick={handleAutoSort} style={{ marginBottom: '1rem' }}>
          Auto Sort by Key
        </button>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                backgroundColor: snapshot.isDraggingOver ? '#f0f0f0' : '#fff',
                padding: 8,
                width: 400,
                border: '1px solid #ccc'
              }}
            >
              {tracks.map((track, index) => (
                <Draggable
                  key={`${track.key}_${track.title}_${index}`}
                  draggableId={`${track.key}_${track.title}_${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        margin: '0 0 8px 0',
                        padding: 8,
                        backgroundColor: snapshot.isDragging
                          ? '#e0e0e0'
                          : '#fafafa',
                        border: '1px solid #ccc',
                        ...provided.draggableProps.style
                      }}
                    >
                      <div><strong>Track Name:</strong> {track.title}</div>
                      <div><strong>Artist:</strong> {track.artist}</div>
                      <div><strong>BPM:</strong> {track.bpm}</div>
                      <div><strong>Key:</strong> {track.key}</div>
                      {track.length !== undefined && (
                        <div><strong>Length:</strong> {Math.floor(track.length / 60)}:{(track.length % 60).toString().padStart(2, '0')}</div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
