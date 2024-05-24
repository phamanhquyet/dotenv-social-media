import { appwriteConfig, databases } from "../appwrite/config";
import { convertToLowerCase, removeSpace } from "../utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onDragEnd = async (result: any, columns: any, setColumns: any) => {
	if (!result.destination) return;

	const { source, destination } = result;

	if (source.droppableId !== destination.droppableId) {
		const sourceColumn = columns[source.droppableId];
		const destColumn = columns[destination.droppableId];
		const sourceItems = [...sourceColumn.items];
		const destItems = [...destColumn.items];
		const [removed] = sourceItems.splice(source.index, 1);
		
		destItems.splice(destination.index, 0, removed);
		console.log("sourceColumn", sourceColumn);
		console.log("destColumn", destColumn);
		console.log("sourceItems", sourceItems);
		console.log("destItems", destItems);
		removed.status = removeSpace(destColumn.name.toLowerCase());
		console.log("removed",removed);
		
		
		// hàm update cột sẽ được đặt ở đây
		setColumns({
			...columns,
			[source.droppableId]: {
				...sourceColumn,
				items: sourceItems,
			},
			[destination.droppableId]: {
				...destColumn,
				items: destItems,
			},
		});
		console.log({
			...columns,
			[source.droppableId]: {
				...sourceColumn,
				items: sourceItems,
			},
			[destination.droppableId]: {
				...destColumn,
				items: destItems,
			},
		});
		try {
			await databases.updateDocument(
				appwriteConfig.databaseId,
				appwriteConfig.taskCollectionId,
				removed.id,
				{
					status: removeSpace(convertToLowerCase(destColumn.name))
				}
			)
			
		} catch (error) {
			console.log(error);
		}
	} else {
		const column = columns[source.droppableId];
		const copiedItems = [...column.items];
		const [removed] = copiedItems.splice(source.index, 1);
		copiedItems.splice(destination.index, 0, removed);
		
		console.log(copiedItems);
		setColumns({
			...columns,
			[source.droppableId]: {
				...column,
				items: copiedItems,
			},
		});
		console.log({
			...columns,
			[source.droppableId]: {
				...column,
				items: copiedItems,
			},
		});
	}
};
