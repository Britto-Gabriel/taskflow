import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

const initialData = {
  "a-fazer": [
    { id: "1", title: "Estudar React" },
    { id: "2", title: "Planejar UI" },
  ],
  "em-progresso": [
    { id: "3", title: "Criar wireframes" },
  ],
  concluido: [],
};

export default function TaskBoard() {
  const [tasks, setTasks] = useState(initialData);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // se soltou fora de uma coluna
    if (!destination) return;

    // mesma coluna
    if (source.droppableId === destination.droppableId) {
      const updated = Array.from(tasks[source.droppableId]);
      const [movedItem] = updated.splice(source.index, 1);
      updated.splice(destination.index, 0, movedItem);

      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: updated,
      }));
    } else {
      // coluna diferente
      const sourceTasks = Array.from(tasks[source.droppableId]);
      const destTasks = Array.from(tasks[destination.droppableId]);

      const [movedItem] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, movedItem);

      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destTasks,
      }));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-4">
        {Object.entries(tasks).map(([columnId, items]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <div
                className="bg-gray-100 rounded p-4 w-64"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="text-lg font-semibold mb-2 capitalize">{columnId.replace("-", " ")}</h2>
                {items.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        className="bg-white rounded shadow p-2 mb-2"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {task.title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}