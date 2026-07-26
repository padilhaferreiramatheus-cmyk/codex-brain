# Segurança E Privacidade

Codex Brain pode conter caminhos locais, relações estratégicas e resumos de
projetos privados.

## Regra Principal

Não publique este repositório sem revisar o conteúdo.

## Nunca Versionar

- tokens;
- senhas;
- chaves de API;
- arquivos `.env`;
- dados de clientes;
- contratos privados;
- documentos pessoais;
- conteúdo bruto de operações internas.

## Preferir

- resumos curtos;
- caminhos locais;
- links para a fonte real;
- nível de privacidade explícito;
- notas sanitizadas.

## Antes De Push Público

Verifique:

- `registry/projects.yml`;
- `registry/projects/`;
- `graph/relations.yml`;
- `docs/`;
- arquivos em `local/`, `private/` ou `secrets/`.

Essas últimas pastas devem permanecer fora do Git.
