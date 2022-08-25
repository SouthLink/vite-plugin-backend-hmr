import { PluginOption } from 'vite';

interface IPluginProps {
    hmrFile?: string | string[];
    hmrDir?: string;
}
declare function ViteBackendHmrPlugin(props?: IPluginProps): PluginOption;

export { ViteBackendHmrPlugin as default };
