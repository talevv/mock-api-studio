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
        </head>
        <body>
          ${this.content}
        </body>
      </html>
    `;
  }
}