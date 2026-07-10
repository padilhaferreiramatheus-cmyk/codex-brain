# Testing

## Automatizado

```bash
npm run typecheck
npm run build
npm test
```

Os testes iniciais cobrem:

- detector de conflitos;
- progress scorer;
- append/read JSONL;
- camada Git fora de repo.

## Manual

```bash
npm run quickstart
npm run smoke
npm run dev -- doctor
npm run dev -- init
npm run dev -- install-hooks
npm run dev -- status
npm run dev -- timeline
npm run dev -- report
npm run dev -- next
npm run dev -- conflict-check "refazer tudo do zero sem teste"
```

No Windows PowerShell, prefira `npm.cmd` se `npm` estiver bloqueado pela execution policy:

```powershell
npm.cmd run quickstart
npm.cmd run smoke
```

## Simulacao de hook

```bash
echo "{\"prompt\":\"refazer tudo do zero sem teste\"}" | node .codex/hooks/codex-brain-user-prompt-submit.js
```

No Windows PowerShell:

```powershell
"{""prompt"":""refazer tudo do zero sem teste""}" | node .codex\hooks\codex-brain-user-prompt-submit.js
```
