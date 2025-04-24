import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// A small helper function to reorder the list after a drag
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function TrackList({ tracks, setTracks }) {
  const onDragEnd = (result) => {
    // If user drops outside the list, do nothing
    if (!result.destination) {
      return;
    }

    const newOrder = reorder(
      tracks,
      result.source.index,
      result.destination.index
    );
    setTracks(newOrder);
  };

  return (
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
            }}
          >
            {tracks.map((track, index) => (
              <Draggable key={index.toString()} draggableId={index.toString()} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      userSelect: 'none',
                      margin: '0 0 8px 0',
                      padding: 8,
                      backgroundColor: snapshot.isDragging ? '#e0e0e0' : '#fafafa',
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
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default TrackList;
