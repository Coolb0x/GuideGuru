export interface SlackMessage {
  text: string;
  channel: string | undefined;
  thread_ts: string;
  bot_id?: string;
  ts: string;
}
export interface UserMessageParams {
  client: any;
  logger: any;
  message: SlackMessage;
  getThreadContext: any;
  say: (message: { text: string }) => Promise<void>;
  setTitle: (title: string) => Promise<void>;
  setStatus: (status: string) => Promise<void>;
}
export interface AssistantMessageData {
  role: string;
  content: any;
}
export interface ThreadContexts {
  [key: string]: any;
}

export interface ThreadStartedParams {
  say: (message: string) => Promise<void>;
}
