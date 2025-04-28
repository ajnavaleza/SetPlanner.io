import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

/**
 * Parse a Camelot key string like "7A" or "10B" into { num: 7, letter: 'A' }.
 */
function parseCamelot(camelotKey) {
  // e.g. "7A" => num=7, letter='A'
  const letter = camelotKey.slice(-1).toUpperCase(); // 'A' or 'B'
  const num = parseInt(camelotKey.slice(0, -1), 10); // e.g. 7
  return { num, letter };
}

/**
 * isCompatible: 
 * We treat 2 Camelot keys as compatible if their numeric values differ by 1, 2, or 3 
 * (with wrap-around at 12, so "12A" and "1A" differ by 1) – ignoring whether it's 'A' or 'B'.
 *
 * Example: "7A" => valid next are "4A/B", "5A/B", "6A/B", "8A/B", "9A/B", "10A/B".
 */
function isCompatible(songA, songB) {
  if (!songA.key || !songB.key) return false;

  const { num: aNum } = parseCamelot(songA.key);
  const { num: bNum } = parseCamelot(songB.key);

  // Compute difference in a circular sense (1 after 12, etc.)
  let diff = Math.abs(aNum - bNum);
  diff = Math.min(diff, 12 - diff); // e.g. "12" vs "1" => diff=1

  // If the numeric difference is in [1..3], it’s “compatible”
  return diff >= 1 && diff <= 3;
}

/**
 * reorderDrag: reorder list after user manually drags a track.
 */
function reorderDrag(list, startIndex, endIndex) {
  const arr = Array.from(list);
  const [removed] = arr.splice(startIndex, 1);
  arr.splice(endIndex, 0, removed);
  return arr;
}

/**
 * autoSortTracks: tries to find *any* ordering of "tracks" 
 * so consecutive songs are isCompatible(...).
 *
 * We'll do a simple backtracking approach: build up a path track-by-track.
 */
function autoSortTracks(tracks) {
  const n = tracks.length;
  const used = new Array(n).fill(false);
  let solution = null;

  function backtrack(path) {
    if (path.length === n) {
      // Found a valid sequence of length n
      solution = [...path];
      return true;
    }
    for (let i = 0; i < n; i++) {
      if (!used[i]) {
        // If first track OR it's compatible with the previous
        if (path.length === 0 || isCompatible(path[path.length - 1], tracks[i])) {
          used[i] = true;
          path.push(tracks[i]);
          if (backtrack(path)) return true;
          path.pop();
          used[i] = false;
        }
      }
    }
    return false;
  }

  backtrack([]);
  return solution; // or null if no arrangement found
}

// Main component: displays track list + "Auto Sort by Key" button
export default function TrackList({ tracks, setTracks }) {
  // Handle manual drag reorder
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newOrder = reorderDrag(tracks, result.source.index, result.destination.index);
    setTracks(newOrder);
  };

  // Called when user clicks "Auto Sort by Key"
  const handleAutoSort = () => {
    const newOrder = autoSortTracks(tracks);
    if (newOrder) {
      // If the new order is the same as the existing one, it won't appear to move
      const unchanged = newOrder.every((track, i) => track === tracks[i]);
      if (unchanged) {
        console.log('Arrangement found, but it matches the current order');
      }
      setTracks(newOrder);
    } else {
      alert('No valid arrangement found based on Camelot compatibility.');
    }
  };

  return (
    <div>
      <h2>Track List</h2>
      {/* Show auto-sort button if there’s at least 2 tracks */}
      {tracks.length > 1 && (
        <button onClick={handleAutoSort} style={{ marginBottom: '1rem' }}>
          Auto Sort by Key
        </button>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                backgroundColor: snapshot.isDraggingOver ? '#f0f0f0' : '#fff',
                padding: 8,
                width: 400,
                border: '1px solid #ccc'
              }}
            >
              {tracks.map((track, index) => (
                <Draggable key={`${track.key}_${index}`} draggableId={`${track.key}_${index}`} index={index}>
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
                    </div>
                  )}
                </Draggable>
              ))}
              {/* React Beautiful DnD placeholder */}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
