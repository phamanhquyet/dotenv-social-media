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

export const base64ToFile = (
  base64String: string,
  fileName: string,
  mimeType: string
): File => {
  // Convert the base64 string to a binary string
  const byteString = atob(base64String.split(",")[1]);

  // Create an array buffer and a view for the binary data
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  // Fill the array with the binary data
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  // Create a Blob from the array buffer
  const blob = new Blob([arrayBuffer], { type: mimeType });

  // Convert the Blob to a File
  return new File([blob], fileName, { type: mimeType });
};

export const convertEmoticons = (text: string): string => {
  const emoticons: { [key: string]: string } = {
    ':)': '😊',      // smiley
    ':-)': '😊',     // smiley with nose
    ':(': '😢',      // sad face
    ':-(': '😢',     // sad face with nose
    ':D': '😁',      // big smile
    ':-D': '😁',     // big smile with nose
    ';)': '😉',      // wink
    ';-)': '😉',     // wink with nose
    ':P': '😛',      // tongue out
    ':-P': '😛',     // tongue out with nose
    ':p': '😛',      // tongue out
    ':-p': '😛',     // tongue out with nose
    ':o': '😮',      // surprised
    ':-o': '😮',     // surprised with nose
    ':O': '😮',      // surprised
    ':-O': '😮',     // surprised with nose
    ':*': '😘',      // kiss
    ':-*': '😘',     // kiss with nose
    '>:(': '😠',     // angry face
    '>:-(': '😠',    // angry face with nose
    '>:)': '😈',     // evil smile
    '>:-)': '😈',    // evil smile with nose
    'XD': '😆',      // laughing eyes closed
    'xD': '😆',      // laughing eyes closed
    '8)': '😎',      // sunglasses
    '8-)': '😎',     // sunglasses with nose
    'B)': '😎',      // sunglasses
    'B-)': '😎',     // sunglasses with nose
    ':/': '😕',      // unsure
    ':-/': '😕',     // unsure with nose
    ':\\': '😕',     // unsure
    ':-\\': '😕',    // unsure with nose
    ':|': '😐',      // neutral face
    ':-|': '😐',     // neutral face with nose
    '3:)': '😈',     // devil face
    '3:-)': '😈',    // devil face with nose
    'o.O': '😳',     // disbelieving
    'O.o': '😳',     // disbelieving
    ':\'(': '😭',    // crying
    ':-\'(': '😭',   // crying with nose
    ';(': '😭',      // crying wink
    ';-(': '😭'      // crying wink with nose
  };

  return text.replace(/(:-?\)|:-?\(|:-?D|;-?\)|:-?P|:-?p|:-?[oO]|:-?\*|>:-?\(|>:-?\)|[XxBb]D|8-?\)|:-?\/|:-?\\|:-?\||3:-?\)|o\.O|O\.o|:-?'?\(|;'-?\()/g, match => emoticons[match] || match);
};

export const removeSpace = (input: string | undefined): string => (input ?? "").replace(/\s+/g, "");

export const formatDeadline = (hours: number): string => {
  const hoursPerDay = 24;
    const hoursPerWeek = 168;

    // Nếu số giờ nhỏ hơn 1, chuyển đổi thành phút
    if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
    // Chuyển đổi giờ thành tuần nếu đủ giờ trong một tuần
    else if (hours >= hoursPerWeek) {
        const weeks = Math.floor(hours / hoursPerWeek);
        return `${weeks} week${weeks > 1 ? 's' : ''}`;
    }
    // Chuyển đổi giờ thành ngày nếu đủ giờ trong một ngày
    else if (hours >= hoursPerDay) {
        const days = Math.floor(hours / hoursPerDay);
        return `${days} day${days > 1 ? 's' : ''}`;
    }
    // Nếu không đủ để thành ngày thì chỉ trả về số giờ
    else {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
};