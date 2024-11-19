export declare class LifecycleAsyncA {
  value: string;
  loads: string[];
  updates: string[];
  rendered: number;
  componentWillUpdated: boolean;
  componentDidUpdated: boolean;
  lifecycleLoad(ev: any): void;
  lifecycleUpdate(ev: any): void;
  componentWillLoad(): Promise<void>;
  componentDidLoad(): Promise<void>;
  componentWillUpdate(): Promise<void>;
  componentDidUpdate(): Promise<void>;
  testClick(): void;
  render(): any;
}
