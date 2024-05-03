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
      set((state) => ({
        comments: [...state.comments, data],
      })),

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
