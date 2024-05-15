/* eslint-disable @typescript-eslint/no-explicit-any */
import Task from "@/components/shared/Task";
import TaskAddModal from "@/components/shared/TaskAddModal";
import { Board } from "@/lib/plan-board/board";
import { onDragEnd } from "@/lib/plan-board/onDragEnd";
import { Columns } from "@/types";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AddOutline } from "react-ionicons";

const PlanBoard = () => {
  const [columns, setColumns] = useState<Columns>(Board);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");

  const openModal = (columnId: any) => {
    setSelectedColumn(columnId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAddTask = (taskData: any) => {
    const newBoard = { ...columns };
    newBoard[selectedColumn].items.push(taskData);
  };
  return (
    <div className="w-full h-full overflow-x-auto relative">
      <div className="w-full h-full overflow-y-auto">
        <>
          <DragDropContext
            onDragEnd={(result: any) => onDragEnd(result, columns, setColumns)}>
            <div className="w-full flex items-start justify-between px-5 pb-8 md:gap-0 gap-10">
              {Object.entries(columns).map(([columnId, column]: any) => (
                <div className="w-full flex flex-col gap-0" key={columnId}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex flex-col md:w-[290px] w-[250px] gap-3 items-center py-5">
                        <div className="flex items-center justify-center py-[10px] w-full bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]">
                          {column.name}
                        </div>
                        {column.items.map((task: any, index: any) => (
                          <Draggable
                            key={task.id.toString()}
                            draggableId={task.id.toString()}
                            index={index}>
                            {(provided: any) => (
                              <>
                                <Task provided={provided} task={task} />
                              </>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <div
                    onClick={() => openModal(columnId)}
                    className="flex cursor-pointer items-center justify-center gap-1 py-[10px] md:w-[90%] w-full opacity-90 bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]">
                    <AddOutline color={"#555"} />
                    Add Task
                  </div>
                </div>
              ))}
            </div>
          </DragDropContext>

          <TaskAddModal
            isOpen={modalOpen}
            onClose={closeModal}
            setOpen={setModalOpen}
            handleAddTask={handleAddTask}
          />
        </>
      </div>
    </div>
  );
};

export default PlanBoard;
