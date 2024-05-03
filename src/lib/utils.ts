import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

//
export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
};

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};

export const checkIsParticipated = (
  participantList: string[],
  userId: string
) => {
  return participantList.includes(userId);
};

export const convertToLowerCase = (input: string): string => {
  return input.toLowerCase();
};

export const convertListStringsToLowerCase = (inputArray: (string | undefined)[]): string => {
  const processedStrings: string[] = [];

  for (const str of inputArray) {
    if (typeof str === 'string') {
      const lowercasedString = str.toLowerCase();
      processedStrings.push(lowercasedString);
    }
  }

  return processedStrings.join('');
};

export const removeVietnameseAccents = (inputArray: (string | undefined)[]): string => {
  const processedArray: string[] = [];

  for (const str of inputArray) {
    if (str !== undefined) {
      const processedString = str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      processedArray.push(processedString);
    }
  }

  return processedArray.join('');
};

export const removeWhitespace = (strings: (string | undefined)[]): string => {
  const processedStrings: string[] = [];

  for (const str of strings) {
    if (typeof str === 'string') {
      const trimmedStr = str.trim(); // Loại bỏ khoảng trắng ở đầu và cuối chuỗi
      const filteredStr = trimmedStr.replace(/\s+/g, ''); // Loại bỏ tất cả các khoảng trắng trong chuỗi
      const lowercasedStr = filteredStr.toLowerCase(); // Chuyển đổi thành chữ thường

      processedStrings.push(lowercasedStr);
    }
  }

  return processedStrings.join('');
};

export const removeAccentsAndWhitespace = (inputArray: (string | undefined)[]): string => {
  const processedStrings: string[] = [];

  for (const str of inputArray) {
    if (typeof str === 'string') {
      // Loại bỏ dấu tiếng Việt và chuyển thành chữ thường
      const noAccentsString = str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      // Loại bỏ tất cả khoảng trắng
      const noWhitespaceString = noAccentsString.replace(/\s+/g, '');

      processedStrings.push(noWhitespaceString);
    }
  }

  return processedStrings.join('');
};