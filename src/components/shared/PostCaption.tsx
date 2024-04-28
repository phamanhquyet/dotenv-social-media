import React from "react";

interface ActivityDetailsProps {
  paragraph: string;
}

const PostCaption: React.FC<ActivityDetailsProps> = ({ paragraph }) => {
  const renderParagraphs = (): React.ReactNode => {
    // Tách đoạn văn thành các đoạn nhỏ dựa trên dấu xuống dòng
    const paragraphs = paragraph.split("\n");

    // Lọc các đoạn văn trống
    const filteredParagraphs = paragraphs.filter((p) => p.trim() !== "");

    // Render các đoạn văn bằng thẻ <p>
    return filteredParagraphs.map((p, index) => <p key={index}>{p}</p>);
  };

  return <div>{renderParagraphs()}</div>;
};

export default PostCaption;
