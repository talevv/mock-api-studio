import { EndpointModel } from "../models/endpoint.model";

export class EndpointsListView {
  endpoints: EndpointModel[];

  constructor(endpoints: EndpointModel[]) {
    this.endpoints = endpoints;
  }

  private mapMethodToColor(method: string): string {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-green-100 text-green-800';
      case 'POST':
        return 'bg-blue-100 text-blue-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'PATCH':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  render(): string {
    if (this.endpoints.length === 0) {
      return `
        <section class="p-6">
          <h1 class="text-2xl font-semibold text-slate-900">Endpoints</h1>
          <p class="mt-1 text-sm text-slate-600">No endpoints defined yet. Start by creating a new endpoint.</p>
        </section>
      `;
    }
    
    const rows = this.endpoints.map((endpoint, index) => {
      const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
      return `
        <tr class="${bgClass}">
          <td class="p-2 border-b border-slate-200">
            <span class="${this.mapMethodToColor(endpoint.method)} px-2 py-1 rounded-md text-xs font-medium}">
              ${endpoint.method}
            </span>
          </td>
          <td class="p-2 border-b border-slate-200 ">${endpoint.name}</td>
          <td class="p-2 border-b border-slate-200 font-mono text-sm">${endpoint.path}</td>
        </tr>
    `}).join('');

    return `
      <section class="p-6">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900">Endpoints</h1>
          <p class="mt-1 text-sm text-slate-600">A table view of API endpoints with method, name, and path.</p>
        </div>

        <table class="table-auto w-full mt-4 border-collapse text-left border border-slate-200">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-2 border-b border-slate-200 ">Method</th>
              <th class="p-2 border-b border-slate-200 ">Name</th>
              <th class="p-2 border-b border-slate-200 ">Path</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </section>
    `;
  }
}