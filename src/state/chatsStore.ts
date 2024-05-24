import { Models } from "appwrite";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type States = {
  chats: Array<Models.Document> | [];
};

type Actions = {
  addChat: (data: Models.Document) => void;
  addChats: (data: Array<Models.Document>) => void;
  deleteChat: (id: string) => void;
};

export const chatStore = create<States & Actions>()(
  devtools((set) => ({
    chats: [],
    // addChat: (data: Models.Document) =>
    //   set((state) => ({
    //     chats: [...state.chats, data],
    //   })),
    addChat: (data: Models.Document) =>
      set((state) => {

        // Kiểm tra xem chat có id tương tự đã tồn tại hay chưa
        const isExisting = state.chats.some((chat) => chat.$id === data.$id);
        if (!isExisting) {
          // Chỉ thêm chat mới nếu nó chưa tồn tại
          return {
            ...state,
            chats: [...state.chats, data],
          };
        } else {
          // Ngược lại, không thêm gì vào state
          return state;
        }
      }),

    addChats: (data: Array<Models.Document>) =>
      set(() => ({
        chats: data,
      })),

    deleteChat: (id: string) =>
      set((state) => ({
        chats: state.chats.filter((item) => item.$id !== id),
      })),
  }))
);
