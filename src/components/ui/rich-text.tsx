import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type RichTextProps = {
  content: string;
};

export function RichText({ content }: RichTextProps) {
  return (
    <div className="editorial-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
