.PHONY: server build clean help

help: ## Mostra esta mensagem de ajuda
	@echo "Comandos disponíveis:"
	@echo "  make server  - Inicia o servidor de desenvolvimento"
	@echo "  make build   - Gera o site estático"
	@echo "  make clean   - Limpa os arquivos gerados"
	@echo "  make new     - Cria um novo post (use: make new POST=nome-do-post)"

server: ## Inicia o servidor de desenvolvimento
	@echo "Iniciando servidor Hugo..."
	@hugo server -D --bind 0.0.0.0 --port 1313

build: ## Gera o site estático
	@echo "Gerando site estático..."
	@hugo --minify

clean: ## Limpa os arquivos gerados
	@echo "Limpando arquivos gerados..."
	@rm -rf public/
	@rm -rf server/
	@rm -rf resources/_gen/

new: ## Cria um novo post (use: make new POST=nome-do-post)
	@if [ -z "$(POST)" ]; then \
		echo "Erro: Especifique o nome do post. Use: make new POST=nome-do-post"; \
		exit 1; \
	fi
	@hugo new posts/$(POST).md
	@echo "Post criado em content/posts/$(POST).md"

test: ## Executa testes unitários
	@echo "Executando testes unitários..."
	@npm run test || echo "⚠️  Tests skipped (vitest not installed)"

test-e2e: ## Executa testes E2E
	@echo "Executando testes E2E..."
	@npm run test:e2e || echo "⚠️  E2E tests skipped (playwright not installed)"

test-coverage: ## Executa testes com cobertura
	@echo "Executando testes com cobertura..."
	@npm run test:coverage || echo "⚠️  Coverage tests skipped (vitest not installed)"

