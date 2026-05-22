# Fakly - FAQ Generator

## Cursor Cloud specific instructions

Fakly is a zero-dependency static website (vanilla HTML/CSS/JS). There is no package manager, no build step, no test framework, and no linter configured.

### Running the application

Serve the project root over HTTP (the `file://` protocol will not work due to Web Component / Shadow DOM constraints):

```
python3 -m http.server 8080 --directory /workspace
```

Then open `http://localhost:8080/` in a browser.

### Code formatting

The only code-quality tool is **Prettier** (configured via `.vscode/settings.json` for format-on-save). There are no ESLint or other linting configurations.

### Testing

There are no automated tests. Manual browser testing is the only verification method. Core flows to check:
- Entering a FAQ title and question/answer pairs
- Live preview updates on the right-hand side
- "Adicionar Pergunta" button adds new Q&A fields
- "Copiar Código" copies the embed snippet
- Data persists via `localStorage`
