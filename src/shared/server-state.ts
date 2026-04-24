export enum ServerStatus {
  RUNNING,
  STOPPED
}

export class ServerState {
  private status: ServerStatus = ServerStatus.STOPPED;

  start() {
    this.status = ServerStatus.RUNNING;
  }

  stop() {
    this.status = ServerStatus.STOPPED;
  }

  getStatus(): ServerStatus {
    return this.status
  }
}