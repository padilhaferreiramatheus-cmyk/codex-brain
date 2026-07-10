export interface AgentProvider {
  name: string;
  detect(): Promise<boolean>;
  runReadOnlyAnalysis?(prompt: string, cwd: string): Promise<string>;
}
