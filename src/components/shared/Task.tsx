/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDeadline } from "@/lib/utils";
import { TaskT } from "@/types";
import { TimeOutline } from "react-ionicons";
import { CloseOutline, PencilOutline } from 'react-ionicons';

interface TaskProps {
	task: TaskT;
	provided: any;
	onDelete: any;	
}

const Task = ({ task, provided, onDelete }: TaskProps) => {
  const { title, description, priority, deadline, image, alt, tags } = task;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="w-full cursor-grab bg-[#dedede] flex flex-col justify-between gap-3 items-start shadow-sm rounded-xl px-3 py-4 mt-3">
      {image && (
        <img src={image} alt={alt} className="w-full h-[170px] rounded-lg" />
      )}
      <div className="flex items-center gap-2">
        {tags.map((tag) => (
          <span
            key={tag.title}
            className="px-[10px] py-[2px] text-[13px] font-medium rounded-md"
            style={{ backgroundColor: tag.bg, color: tag.text }}>
            {tag.title}
          </span>
        ))}
		<div className="flex items-center gap-1">
                    <button className="p-1">
                        <PencilOutline color={'#555555'} title="Edit task" height="20px" width="20px" />
                    </button>
                    <button onClick={() => onDelete(task)} className="p-1">
                        <CloseOutline color={'#FF0000'} title="Delete task" height="20px" width="20px" />
                    </button>
                </div>
      </div>
      <div className="w-full flex items-start flex-col gap-0">
        <span className="text-[15.5px] font-medium text-[#555]">{title}</span>
        <span className="text-[13.5px] text-gray-500">{description}</span>
      </div>
      <div className="w-full border border-dashed"></div>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-1">
          <TimeOutline color={"#666"} width="19px" height="19px" />
          <span className="text-[13px] text-gray-700">{formatDeadline(deadline)}</span>
        </div>
        <div
          className={`w-[60px] rounded-full h-[5px] ${
            priority === "high"
              ? "bg-red"
              : priority === "medium"
              ? "bg-orange-500"
              : "bg-blue-500"
          }`}></div>
      </div>
    </div>
  );
};

export default Task;
