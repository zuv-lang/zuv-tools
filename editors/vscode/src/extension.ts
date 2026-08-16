import {
    workspace,
    ExtensionContext,
    window
} from 'vscode';

import {
    LanguageClient,
    LanguageClientOptions,
    Executable
} from 'vscode-languageclient/node';

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as https from 'https';
import { execFileSync } from 'child_process';

let client: LanguageClient;

const GITHUB_RELEASE_BASE =
    'https://github.com/zuv-lang/zuv-tools/releases/download';

interface PlatformInfo {
    asset: string;
    binary: string;
}

function getZuvBinDirectory(): string {
    return path.join(
        os.homedir(),
        'zuv',
        'bin'
    );
}

function getPlatformInfo(): PlatformInfo {
    if (
        process.platform === 'win32' &&
        process.arch === 'x64'
    ) {
        return {
            asset: 'zuv-lsp-windows-x64.zip',
            binary: 'zuv-lsp.exe'
        };
    }

    if (
        process.platform === 'linux' &&
        process.arch === 'x64'
    ) {
        return {
            asset: 'zuv-lsp-linux-x64.tar.gz',
            binary: 'zuv-lsp'
        };
    }

    if (
        process.platform === 'darwin' &&
        process.arch === 'arm64'
    ) {
        return {
            asset: 'zuv-lsp-macos-arm64.tar.gz',
            binary: 'zuv-lsp'
        };
    }

    throw new Error(
        `Unsupported Zuv platform: ${process.platform}-${process.arch}`
    );
}

function getZuvVersion(
    context: ExtensionContext
): string {
    const version =
        context.extension.packageJSON.version;

    if (
        typeof version !== 'string' ||
        version.length === 0
    ) {
        throw new Error(
            'Unable to determine Zuv extension version.'
        );
    }

    return version;
}

function downloadFile(
    url: string,
    destination: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = https.get(
            url,
            response => {
                /*
                 * GitHub releases redirect to the actual
                 * asset location. Follow redirects.
                 */
                if (
                    response.statusCode &&
                    response.statusCode >= 300 &&
                    response.statusCode < 400 &&
                    response.headers.location
                ) {
                    response.resume();

                    downloadFile(
                        response.headers.location,
                        destination
                    )
                        .then(resolve)
                        .catch(reject);

                    return;
                }

                if (response.statusCode !== 200) {
                    response.resume();

                    reject(
                        new Error(
                            `Download failed with HTTP ${response.statusCode}`
                        )
                    );

                    return;
                }

                const file =
                    fs.createWriteStream(destination);

                response.pipe(file);

                file.on('finish', () => {
                    file.close();
                    resolve();
                });

                file.on('error', error => {
                    file.close();

                    reject(error);
                });
            }
        );

        request.on('error', reject);
    });
}

function extractArchive(
    archive: string,
    destination: string
): void {
    if (process.platform === 'win32') {
        /*
         * Windows:
         * Extract .zip using PowerShell.
         */
        execFileSync(
            'powershell.exe',
            [
                '-NoProfile',
                '-NonInteractive',
                '-Command',
                `Expand-Archive -LiteralPath '${archive}' -DestinationPath '${destination}' -Force`
            ],
            {
                stdio: 'ignore'
            }
        );

        return;
    }

    /*
     * Linux / macOS:
     * Extract .tar.gz using tar.
     */
    execFileSync(
        'tar',
        [
            '-xzf',
            archive,
            '-C',
            destination
        ],
        {
            stdio: 'ignore'
        }
    );
}

async function getLanguageServer(
    context: ExtensionContext
): Promise<string> {
    const binDirectory =
        getZuvBinDirectory();

    const platform =
        getPlatformInfo();

    const serverPath =
        path.join(
            binDirectory,
            platform.binary
        );

    /*
     * If the LSP already exists in:
     *
     *   ~/zuv/bin/
     *
     * use it directly.
     */
    if (fs.existsSync(serverPath)) {
        return serverPath;
    }

    const version =
        getZuvVersion(context);

    const releaseBase =
        `${GITHUB_RELEASE_BASE}/v${version}`;

    const archivePath =
        path.join(
            binDirectory,
            platform.asset
        );

    const downloadUrl =
        `${releaseBase}/${platform.asset}`;

    await window.withProgress(
        {
            location: {
                viewId: 'zuv'
            },
            title:
                `Downloading Zuv Language Server v${version}...`
        },
        async () => {
            /*
             * Create:
             *
             * Windows:
             * C:\Users\<user>\zuv\bin
             *
             * Linux:
             * /home/<user>/zuv/bin
             *
             * macOS:
             * /Users/<user>/zuv/bin
             */
            fs.mkdirSync(
                binDirectory,
                {
                    recursive: true
                }
            );

            /*
             * Download platform-specific release.
             */
            await downloadFile(
                downloadUrl,
                archivePath
            );

            /*
             * Extract the archive.
             */
            extractArchive(
                archivePath,
                binDirectory
            );

            /*
             * Remove downloaded archive after
             * successful extraction.
             */
            fs.rmSync(
                archivePath,
                {
                    force: true
                }
            );
        }
    );

    /*
     * Verify that the expected LSP binary exists.
     */
    if (!fs.existsSync(serverPath)) {
        throw new Error(
            `Zuv Language Server was not found after installation: ${serverPath}`
        );
    }

    /*
     * Linux/macOS binaries need execute permission.
     */
    if (process.platform !== 'win32') {
        fs.chmodSync(
            serverPath,
            0o755
        );
    }

    return serverPath;
}

export async function activate(
    context: ExtensionContext
): Promise<void> {
    try {
        /*
         * Find or download the correct LSP.
         */
        const serverPath =
            await getLanguageServer(context);

        const serverOptions: Executable = {
            command: serverPath,

            options: {
                env: process.env
            }
        };

        const clientOptions: LanguageClientOptions = {
            documentSelector: [
                {
                    scheme: 'file',
                    language: 'zuv'
                }
            ],

            synchronize: {
                fileEvents:
                    workspace.createFileSystemWatcher(
                        '**/*.zv'
                    )
            }
        };

        client = new LanguageClient(
            'zuvLSP',
            'Zuv Language Server',
            serverOptions,
            clientOptions
        );

        client.start();
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : String(error);

        window.showErrorMessage(
            `Zuv Language Server failed to start: ${message}`
        );

        console.error(
            'Zuv Language Server error:',
            error
        );
    }
}

export function deactivate():
    Thenable<void> | undefined {

    if (!client) {
        return undefined;
    }

    return client.stop();
}
