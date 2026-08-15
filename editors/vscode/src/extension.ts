import * as path from 'path';
import * as fs from 'fs';
import { workspace, ExtensionContext } from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    Executable
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    // 1. Check if zuv-lsp binary exists inside the extension directory
    let serverPath = context.asAbsolutePath('zuv-lsp.exe');

    // 2. Fallback: check workspace / system PATH or sub_projects/zuv-tools
    if (!fs.existsSync(serverPath)) {
        serverPath = 'zuv-lsp'; // fallback to PATH lookup
    }

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
