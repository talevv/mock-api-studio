export class Layout {
  title: string;
  content: string;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }

  render(): string {
    return `
      <html>
        <head>
          <title>${this.title}</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body>
          ${this.content}
        </body>
      </html>
    `;
  }
}