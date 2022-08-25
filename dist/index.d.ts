import { PluginOption } from 'vite';

interface IPluginProps {
    hmrFile?: string | string[];
    hmrDir?: string;
}
declare function ViteReactBackendHmrPlugin(props?: IPluginProps): PluginOption;

export { ViteReactBackendHmrPlugin as default };
