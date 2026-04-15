import { EndpointModel } from "../models/endpoint.model";
import { mapMethodToColor } from "../helpers/helpers";

export class EndpointsListView {
  endpoints: EndpointModel[];
  updateSuccess: boolean = false;

  constructor(endpoints: EndpointModel[], updateSuccess: boolean = false) {
    this.endpoints = endpoints;
    this.updateSuccess = updateSuccess;
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
            <span class="${mapMethodToColor(endpoint.method)} px-2 py-1 rounded-md text-xs font-medium}">
              ${endpoint.method}
            </span>
          </td>
          <td class="p-2 border-b border-slate-200">
          <a href="/endpoints/${endpoint.id}" class="text-blue-600 hover:underline">
            ${endpoint.name}
          </a>
          </td>
          <td class="p-2 border-b border-slate-200 font-mono text-sm">${endpoint.path}</td>
          <td class="p-2 border-b border-slate-200 ">
            <input type="checkbox" name="active" value="${endpoint.id}" ${endpoint.active ? 'checked' : ''}>
          </td>
          <td class="p-2 border-b border-slate-200 ">
            <div class="inline-flex mr-4">
                <button name="direction" name="direction" value="up" formmethod="post" formaction="/endpoints/${endpoint.id}/move">↑</button>
                <button name="direction" name="direction" value="down" formmethod="post" formaction="/endpoints/${endpoint.id}/move">↓</button>
            </div>
            <a href="/endpoints/${endpoint.id}/edit" class="text-blue-600 hover:underline mr-4">
              Edit
            </a>
            <button type="submit" class="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700" formmethod="post" formaction="/endpoints/${endpoint.id}/delete">
              Delete
            </button>
          </td>
        </tr>
    `}).join('');

    return `
      <section class="p-6">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900">Endpoints</h1>
          <p class="mt-1 text-sm text-slate-600">A table view of API endpoints with method, name, and path.</p>
        </div>

        ${this.updateSuccess ? (
          `<div class="mt-4 p-4 bg-green-100 text-green-800">
            Endpoints updated successfully!
          </div>`
        ) : ''}

        <form method="POST" action="/endpoints/activate">
          <button type="submit" class="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Save active endpoints
          </button>
          <table class="table-auto w-full mt-4 border-collapse text-left border border-slate-200">
            <thead>
              <tr class="bg-gray-100">
                <th class="p-2 border-b border-slate-200 ">Method</th>
                <th class="p-2 border-b border-slate-200 ">Name</th>
                <th class="p-2 border-b border-slate-200 ">Path</th>
                <th class="p-2 border-b border-slate-200 ">Active</th>
                <th class="p-2 border-b border-slate-200 ">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </form>
      </section>
    `;
  }
}