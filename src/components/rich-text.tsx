import type { ReactNode } from "react";

/** Safe, dependency-free renderer for admin-entered lightweight Markdown. */
export function RichText({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
  let list: string[] = [];
  let ordered = false;

  const flush = () => {
    if (list.length === 0) return;
    const items = list.map((item, index) => <li key={index}>{item}</li>);
    nodes.push(ordered ? <ol key={`ol-${nodes.length}`}>{items}</ol> : <ul key={`ul-${nodes.length}`}>{items}</ul>);
    list = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flush();
      return;
    }
    if (trimmed.startsWith("### ")) {
      flush();
      nodes.push(<h3 key={index}>{trimmed.slice(4)}</h3>);
      return;
    }
    if (trimmed.startsWith("## ")) {
      flush();
      nodes.push(<h2 key={index}>{trimmed.slice(3)}</h2>);
      return;
    }
    if (trimmed.startsWith("# ")) {
      flush();
      nodes.push(<h2 key={index}>{trimmed.slice(2)}</h2>);
      return;
    }
    if (/^[-*] /.test(trimmed)) {
      if (ordered) flush();
      ordered = false;
      list.push(trimmed.slice(2));
      return;
    }
    if (/^\d+[.)] /.test(trimmed)) {
      if (!ordered) flush();
      ordered = true;
      list.push(trimmed.replace(/^\d+[.)] /, ""));
      return;
    }
    flush();
    nodes.push(<p key={index}>{trimmed}</p>);
  });
  flush();

  return <div className="prose-lite">{nodes}</div>;
}
