import { useEffect, useRef, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { marked } from "marked";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copilotAPIConfig } from "@/lib/copilot/config";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";

interface Source {
  image?: string;
  title: string;
  url: string;
}

interface ChatMessage {
  id: string;
  user_id: string;
  name: string;
  message: string;
  sources?: Source[];
  conversationId?: string;
}

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [dots, setDots] = useState("");

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (loading) {
      intervalId = setInterval(() => {
        setDots((prevDots) => {
          if (prevDots === "...") {
            return "";
          } else {
            return prevDots + ".";
          }
        });
      }, 500); // Thay đổi tốc độ hiển thị dấu chấm tại đây
    } else {
      setDots(""); // Reset dấu chấm khi loading kết thúc
    }

    return () => {
      clearInterval(intervalId); // Xóa interval khi unmount component
    };
  }, [loading]);
  const fetchBotMessage = async (message: string) => {
    setLoading(true);
    const options: AxiosRequestConfig = {
      method: "POST",
      url: "https://copilot5.p.rapidapi.com/copilot",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": copilotAPIConfig.xRapidAPIKey,
        "X-RapidAPI-Host": copilotAPIConfig.xRapidAPIHost,
      },
      data: {
        message: message,
        conversation_id: null,
        tone: "BALANCED",
        markdown: true,
        photo_url: null,
      },
    };

    try {
      const response: AxiosResponse = await axios.request(options);
      console.log(response);
      const botMessage: string = response.data.data.message;
      const sources: Source[] = response.data.data.sources;
      console.log("sources: ", sources);

      // Chuyển đổi Markdown thành HTML
      //@ts-expect-error tam thoi bo qua loi nay
      const parsedMessage: string = marked(botMessage);

      // Thêm tin nhắn từ bot vào danh sách hiển thị
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: "bot-" + Date.now(),
          user_id: "bot",
          name: "DotENV AI Assistant",
          message: parsedMessage,
          sources: sources,
        },
      ]);

      // Cuộn xuống cuối danh sách tin nhắn
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
      console.log(messages);
    } catch (error) {
      console.error("Error fetching bot message:", error);
    } finally {
      setLoading(false); // Ẩn hiệu ứng loading sau khi nhận phản hồi
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Xóa nội dung tin nhắn sau khi gửi
    setMessage("");
    setInputDisabled(true);

    // Gửi tin nhắn từ người dùng và lấy tin nhắn từ bot
    if (message.trim() !== "") {
      // Thêm tin nhắn từ người dùng vào danh sách hiển thị
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: "user-" + Date.now(),
          user_id: "user",
          name: "You",
          message: message,
        },
      ]);

      // Gửi tin nhắn từ người dùng đến bot và lấy tin nhắn từ bot
      await fetchBotMessage(message);
    }
    setInputDisabled(false);
  };

  const handleSourceUrl = (url: string) => {
    try {
      // Kiểm tra và xử lý URL không hợp lệ trước khi tạo đối tượng URL
      const validUrl = url.trim(); // Loại bỏ các khoảng trắng thừa
      const parsedUrl = new URL(validUrl);

      // Trích xuất domain từ URL hợp lệ
      const domain = parsedUrl.hostname;
      return domain;
    } catch (error) {
      console.error("Error parsing URL:", error);
      return ""; // Trả về giá trị mặc định nếu có lỗi
    }
  };

  return (
    <div className="flex flex-col h-screen justify-between p-4">
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar mb-14">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`text-justify mb-2 ${
              msg.user_id === "user" ? "bg-gray-800" : "bg-gray-600"
            } p-2 rounded-md`}>
            <strong>{msg.name}: </strong>
            <span
              className="leading-loose"
              dangerouslySetInnerHTML={{ __html: msg.message }}
            />
            {msg.user_id !== "user" && ( // Sử dụng điều kiện để kiểm tra nếu user_id không phải là "user"
              <div className="pt-4 flex flex-row items-center gap-3">
                <span>Learn more:</span>
                <div className="flex flex-row max-w-prose overflow-x-auto custom-scrollbar gap-3 pb-2">
                  {msg.sources?.map((source) => (
                    <TooltipProvider key={source.url}>
                      {" "}
                      {/* Đảm bảo sử dụng key duy nhất cho mỗi phần tử trong mảng */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline">
                            {handleSourceUrl(source.url)}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <a
                            className="text-violet-600 underline"
                            href={source.url}
                            target="_blank" // Mở liên kết trong tab mới
                            rel="noopener noreferrer" // Bảo mật liên kết ngoài
                          >
                            {source.url}
                          </a>
                          <div>
                            <p className="text-green-600 no-underline overflow-hidden text-ellipsis whitespace-nowrap">
                              {source.title}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-center items-center">
            <p>Generating answer for you{dots} </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input Box */}
      <div className=" fixed bottom-0  w-3/4">
        <form onSubmit={handleSubmit} className="flex justify-center">
          <div className="flex items-center space-x-2 w-3/4 mb-3">
            <Input
              type="text"
              placeholder="Type message..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              className="shad-input w-full"
              disabled={inputDisabled}></Input>
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded">
              {loading ? (
                <Loader />
              ) : (
                <img
                  src="/assets/icons/send-message.svg"
                  alt="Send"
                  className="h-6 w-6 invert-white"
                />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
