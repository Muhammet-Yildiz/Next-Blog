import React from "react";
import markdownit from "markdown-it";
import DOMPurify from "dompurify";

type MarkdownProps = {
  text: string;
};

const md = markdownit({
  linkify: true, 
  html: true, 
});

export const Markdown = ({ text }: MarkdownProps) => {
  const transformLinks = (html: string) => {
    return html.replace(
      /<a href="(.*?)"/g, 
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-violet-500 hover:underline">'
    );
  };

  const sanitized = DOMPurify.sanitize(text, { 
    ADD_ATTR: ['target', 'href', 'rel'], 
    ADD_TAGS: ['a'], 
  });

  let html = md.render(sanitized);
  html = transformLinks(html); 

  return <div dangerouslySetInnerHTML={{ __html: html }}/>;
};