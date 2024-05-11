import { Models } from "appwrite";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type States = {
    comments: Array<Models.Document> | [];
};

type Actions = {
    addComment: (data: Models.Document) => void;
    addComments: (data: Array<Models.Document>) => void;
    deleteComment: (id: string) => void;
};

export const commentStore = create<States & Actions>()(
    devtools((set) => ({
        comments: [],

        addComment: (data: Models.Document) =>
            set((state) => {
                // comments: [...state.comments, data],

                // Kiểm tra xem comment có id tương tự đã tồn tại hay chưa
                const isExisting = state.comments.some(comment => comment.$id === data.$id);
                if (!isExisting) {
                    // Chỉ thêm comment mới nếu nó chưa tồn tại
                    return {
                        comments: [...state.comments, data]
                    };
                } else {
                    // Ngược lại, không thêm gì vào state
                    return state;
                }
            }),

        addComments: (data: Array<Models.Document>) =>
            set(() => ({
                comments: data,
            })),

        deleteComment: (id: string) =>
            set((state) => ({
                comments: state.comments.filter((item) => item.$id !== id),
            })),
    }))
);