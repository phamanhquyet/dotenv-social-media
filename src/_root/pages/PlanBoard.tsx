/* eslint-disable @typescript-eslint/no-explicit-any */
import Task from "@/components/shared/Task";
import TaskAddModal from "@/components/shared/TaskAddModal";
import { useToast } from "@/components/ui/use-toast";
import { appwriteConfig, databases } from "@/lib/appwrite/config";
import { Board } from "@/lib/plan-board/board";
import { onDragEnd } from "@/lib/plan-board/onDragEnd";
import { Columns } from "@/types";
import { Query } from "appwrite";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AddOutline } from "react-ionicons";
import { useParams } from "react-router-dom";
import { getRandomColors } from '@/lib/plan-board/getRandomColors';
import { deleteFile, getFilePreview, uploadFile } from "@/lib/appwrite/api";
import { base64ToFile, removeSpace } from "@/lib/utils";

const PlanBoard = () => {
  const [columns, setColumns] = useState<Columns>(Board);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const { id } = useParams();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        for (const key in columns) {
          if (
            Object.prototype.hasOwnProperty.call(columns, key) &&
            columns[key].items
          ) {
            columns[key].items = []; // Xóa tất cả các phần tử trong mảng items
          }
        }
        const tasks = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.taskCollectionId,
          [Query.equal("community_id", id ?? "")]
        );
        if (tasks) {
          const newBoard = { ...columns };
          
          tasks.documents.forEach((task: any) => {
            newBoard[task.status].items.push({
              id: task.$id,
              title: task.title,
              description: task.description,
              priority: task.priority,
              deadline: task.deadline,
              tags: task.tags.map((tag: any) => ({
                title: tag,
                ...getRandomColors(),
              })),
              image: task.imageUrl,
              imageId: task.imageId,
              status: task.status
            });
          });
          console.log(newBoard);
          setColumns(newBoard);
        }
      } catch (error: any) {
        toast({
          title: error.message,
        });
      }
    };
    fetchTasks();
  }, []);

  const openModal = (columnId: any) => {
    setSelectedColumn(columnId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const handleAddTask = async (taskData: any) => {
    const newBoard = { ...columns };
    
    try {
      let fileUrl, uploadedFile;
      if (taskData.image !== "") {
        //Upload image to storage
        uploadedFile = await uploadFile(
          base64ToFile(taskData.image, "image.jpg", "image/jpeg")
        );

        if (!uploadedFile) throw Error;

        //get file url
        fileUrl = getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
          await deleteFile(uploadedFile.$id);
          throw Error;
        }
      }

      const task = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.taskCollectionId,
        taskData.id,
        {
          community_id: id,
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          deadline: Number(taskData.deadline),
          tags: taskData.tags.map((tag: any) => tag.title),
          status: removeSpace(selectedColumn),
          imageUrl: fileUrl ? fileUrl : null,
          imageId: uploadedFile ? uploadedFile.$id : null,
        }
      );
      if (task) {
        //newBoard[selectedColumn].items.push(taskData);
        const updatedItems = [...newBoard[selectedColumn].items, taskData];
        newBoard[selectedColumn].items = updatedItems;
        setColumns(newBoard);
      }
    } catch (error: any) {
      toast({
        title: error.message,
      });
    }
  };

  const handleDeleteTask = async (task: any) => {
    const updatedColumns = {...columns};
    console.log(task);
    const tasks = updatedColumns[task.status].items;
    const updatedTasks = tasks.filter(t => t.id !== task.id);
    updatedColumns[task.status].items = updatedTasks;
    setColumns(updatedColumns);

    const deletedTask = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.taskCollectionId,
      task.id
    );

    if (!deletedTask) throw Error;

    if(task.imageId) {
      await deleteFile(task.imageId);
    }
};


  // return (
  //   <div className="w-full h-full overflow-x-auto relative bg-my-image bg-cover bg-no-repeat bg-center">
  //     <div className="w-full h-full overflow-y-auto">
  //       <>
  //         <DragDropContext
  //           onDragEnd={(result: any) => onDragEnd(result, columns, setColumns)}>
  //           <div className="w-full flex items-start justify-between px-5 pb-8 md:gap-0 gap-10">
  //             {Object.entries(columns).map(([columnId, column]: any) => (
  //               <div className="w-full flex flex-col gap-0" key={columnId}>
  //                 <Droppable droppableId={columnId} key={columnId}>
  //                   {(provided: any) => (
  //                     <div
  //                       ref={provided.innerRef}
  //                       {...provided.droppableProps}
  //                       className="flex flex-col md:w-[290px] w-[250px] gap-3 items-center py-5">
  //                       <div className="flex items-center justify-center py-[10px] w-full bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]">
  //                         {column.name}
  //                       </div>
  //                       {column.items.map((task: any, index: any) => (
  //                         <Draggable
  //                           key={task.id.toString()}
  //                           draggableId={task.id.toString()}
  //                           index={index}>
  //                           {(provided: any) => (
  //                             <>
  //                               <Task
  //                                 provided={provided}
  //                                 task={task}
  //                                 onDelete={handleDeleteTask}
  //                               />
  //                             </>
  //                           )}
  //                         </Draggable>
  //                       ))}
  //                       {provided.placeholder}
  //                     </div>
  //                   )}
  //                 </Droppable>
  //                 <div
  //                   onClick={() => openModal(columnId)}
  //                   className="flex cursor-pointer items-center justify-center gap-1 py-[10px] md:w-[90%] w-full opacity-90 bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]">
  //                   <AddOutline color={"#555"} />
  //                   Add Task
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         </DragDropContext>

  //         <TaskAddModal
  //           isOpen={modalOpen}
  //           onClose={closeModal}
  //           setOpen={setModalOpen}
  //           handleAddTask={handleAddTask}
  //         />
  //       </>
  //     </div>
  //   </div>
  // );
  return (
    <div className="w-full h-full overflow-x-auto relative bg-my-image bg-cover bg-no-repeat bg-center">
      <div className="w-full h-full overflow-y-auto">
        <>
          <DragDropContext
            onDragEnd={(result: any) => onDragEnd(result, columns, setColumns)}>
            <div className="flex no-wrap overflow-x-auto px-5 py-8">
              {Object.entries(columns).map(([columnId, column]: any) => (
                <div key={columnId}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex-shrink-0 min-w-[290px] max-w-[290px] gap-3 items-center py-5 bg-white rounded-lg shadow-sm mr-4 p-2">
                        <div className="text-center text-[#555] font-medium text-[15px]">
                          {column.name}
                        </div>
                        {column.items.map((task: any, index: any) => (
                          <Draggable
                            key={task.id.toString()}
                            draggableId={task.id.toString()}
                            index={index}>
                            {(provided: any) => (
                              <>
                                <Task
                                  provided={provided}
                                  task={task}
                                  onDelete={handleDeleteTask}
                                />
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
                    className="mt-3 py-[10px] max-w-[290px] bg-white text-[#555] font-medium opacity-90 rounded-lg shadow-sm text-[15px] flex cursor-pointer items-center justify-center ">
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
