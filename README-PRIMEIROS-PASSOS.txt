VOX V5 — PRIMEIROS PASSOS
=========================

1) Extraia a pasta VOX_V5.
2) Envie TODOS os arquivos e pastas para a raiz do seu repositório GitHub.
   A estrutura precisa ficar assim:
   index.html
   css/style.css
   js/main.js
   js/config.js
   js/state.js
   ...demais módulos...
   sql/supabase-schema.sql

3) Abra js/config.js.
   Para testar sem configurar banco, deixe DEMO_MODE = true.
   O modo demonstração guarda o progresso apenas durante a sessão atual.
   Para habilitar contas e nuvem, preencha:
     SUPABASE_URL
     SUPABASE_PUBLISHABLE_KEY
   Depois mude DEMO_MODE para false.

4) Supabase:
   - No painel do Supabase, confira Authentication > URL Configuration.
   - Configure a URL publicada do seu site como Site URL e Redirect URL.
   - Se ainda não tiver as tabelas, execute sql/supabase-schema.sql no SQL Editor.
   - Use somente chave publishable/anon no navegador. NUNCA use service_role/secret key.

5) GitHub Pages:
   - Faça commit de todos os arquivos.
   - Aguarde o Pages publicar.
   - Abra o site e use Ctrl + F5.
   - Teste primeiro "ENTRAR EM MODO DEMONSTRAÇÃO".

O QUE JÁ FUNCIONA NESTE PROTÓTIPO
- Navegação entre páginas.
- Mapa Leaflet com quatro ocorrências ficcionais clicáveis.
- Missões com verificação de objetivos.
- Exploração inicial de duas dimensões e coleta de fragmento.
- Inventário local.
- Scanner laboratorial simulado.
- Diário de atividades.
- Níveis, XP, créditos e estatísticas.
- Estrutura de autenticação e persistência Supabase opcional.

LIMITES IMPORTANTES
- O mapa usa OpenStreetMap e os pontos de anomalia são ficcionais.
- A varredura do laboratório é uma simulação de interface, não uma análise científica.
- O modo demonstração não salva entre dispositivos nem após limpar os dados do navegador.
- Missões, inventário e diário ainda são locais; a persistência em nuvem desses módulos será uma próxima etapa.
- A pasta não inclui chaves secretas, imagens licenciadas ou serviços pagos.
