import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let decorationType: vscode.TextEditorDecorationType | undefined;
let underlineTexts: string[] = [];

export function activate(context: vscode.ExtensionContext) {
    console.log('Mastei Code extension is now active');

    // Load underline.json file
    loadUnderlineTexts();

    // Create decoration type
    updateDecorationType();

    // Decorate active editor
    if (vscode.window.activeTextEditor) {
        updateDecorations(vscode.window.activeTextEditor);
    }

    // Watch for active editor changes
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                updateDecorations(editor);
            }
        })
    );

    // Watch for document changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                updateDecorations(editor);
            }
        })
    );

    // Watch for configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('masteiCode')) {
                updateDecorationType();
                if (vscode.window.activeTextEditor) {
                    updateDecorations(vscode.window.activeTextEditor);
                }
            }
        })
    );

    // Watch for underline.json file changes
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        const underlineJsonPath = path.join(workspaceFolders[0].uri.fsPath, 'underline.json');
        const watcher = fs.watch(underlineJsonPath, (eventType) => {
            if (eventType === 'change') {
                loadUnderlineTexts();
                if (vscode.window.activeTextEditor) {
                    updateDecorations(vscode.window.activeTextEditor);
                }
            }
        });
        context.subscriptions.push({ dispose: () => watcher.close() });
    }
}

function loadUnderlineTexts() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        console.log('No workspace folder found');
        return;
    }

    const underlineJsonPath = path.join(workspaceFolders[0].uri.fsPath, 'underline.json');
    
    try {
        if (fs.existsSync(underlineJsonPath)) {
            const content = fs.readFileSync(underlineJsonPath, 'utf8');
            underlineTexts = JSON.parse(content);
            console.log('Loaded underline texts:', underlineTexts);
        } else {
            console.log('underline.json not found at:', underlineJsonPath);
            underlineTexts = [];
        }
    } catch (error) {
        console.error('Error loading underline.json:', error);
        underlineTexts = [];
    }
}

function updateDecorationType() {
    const config = vscode.workspace.getConfiguration('masteiCode');
    const underlineColor = config.get<string>('underlineColor', '#FF0000');
    const underlineStyle = config.get<string>('underlineStyle', 'solid');
    const backgroundColor = config.get<string>('backgroundColor', '');

    // Dispose of old decoration type
    if (decorationType) {
        decorationType.dispose();
    }

    // Create new decoration type
    const decorationOptions: vscode.DecorationRenderOptions = {
        textDecoration: `underline ${underlineStyle} ${underlineColor}`
    };

    if (backgroundColor) {
        decorationOptions.backgroundColor = backgroundColor;
    }

    decorationType = vscode.window.createTextEditorDecorationType(decorationOptions);
}

function updateDecorations(editor: vscode.TextEditor) {
    if (!decorationType) {
        return;
    }

    // Only apply to YAML files
    if (editor.document.languageId !== 'yaml') {
        editor.setDecorations(decorationType, []);
        return;
    }

    const text = editor.document.getText();
    const decorations: vscode.DecorationOptions[] = [];

    // Search for each text sequence from underline.json
    for (const searchText of underlineTexts) {
        if (!searchText) {
            continue;
        }

        // Normalize text for searching (handle accents and special characters)
        const searchTextNormalized = normalizeText(searchText);
        const textNormalized = normalizeText(text);

        let startIndex = 0;
        let index = textNormalized.indexOf(searchTextNormalized, startIndex);
        while (index !== -1) {
            // Get the actual position in the original text
            const startPos = editor.document.positionAt(index);
            const endPos = editor.document.positionAt(index + searchText.length);

            const decoration: vscode.DecorationOptions = {
                range: new vscode.Range(startPos, endPos)
            };
            decorations.push(decoration);

            startIndex = index + searchText.length;
            index = textNormalized.indexOf(searchTextNormalized, startIndex);
        }
    }

    editor.setDecorations(decorationType, decorations);
}

function normalizeText(text: string): string {
    // Normalize to NFD (decomposed form) to handle accents consistently
    return text.normalize('NFD');
}

export function deactivate() {
    if (decorationType) {
        decorationType.dispose();
    }
}
