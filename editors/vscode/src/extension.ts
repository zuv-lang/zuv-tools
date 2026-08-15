import { workspace, ExtensionContext } from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    Executable
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    const serverPath = context.asAbsolutePath('server/zuv-lsp.exe');

    const serverOptions: Executable = {
        command: serverPath,
        options: {
            env: process.env
        }
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'zuv' }],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/*.zv')
        }
    };

    client = new LanguageClient(
        'zuvLSP',
        'Zuv Language Server',
        serverOptions,
        clientOptions
    );

    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
