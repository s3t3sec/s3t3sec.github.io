# Imagens do write-up Included

Foram identificadas 17 capturas referenciadas no arquivo `Included.md` do Obsidian. Os arquivos originais não foram modificados.

As versões públicas de `09-arquivos-autenticacao.png` e `10-upgrade-pty.png` têm tarjas opacas permanentes sobre os valores de autenticação. As capturas originais dessas duas imagens foram preservadas apenas no backup local `docs/sources/included-original-images/`, excluído do Git. Para regenerar as versões públicas a partir desse backup, execute `node scripts/redact-included-images.mjs`.

Coloque o conteúdo da pasta `included/` em `public/images/writeups/included/` no projeto Astro.

| Original | Novo arquivo | Texto alternativo (alt) |
|---|---|---|
| `Pasted image 20261011131503.png` | `01-nmap-reconhecimento.png` | Terminal com resultados de varreduras Nmap identificando os serviços HTTP e TFTP. |
| `Pasted image 20261011131702.png` | `02-aplicacao-web.png` | Página inicial da aplicação web Titan Gears aberta no navegador. |
| `Pasted image 20261011131730.png` | `03-teste-lfi.png` | Navegador mostrando o teste de inclusão de arquivo local pela aplicação web. |
| `Pasted image 20261011131908.png` | `04-conexao-tftp.png` | Terminal conectado ao serviço TFTP da máquina Included. |
| `Pasted image 20261011132011.png` | `05-upload-tftp.png` | Terminal com o comando put teste.php para transferir o arquivo pelo TFTP. |
| `Pasted image 20261011132113.png` | `06-execucao-php-lfi.png` | Navegador exibindo o resultado do arquivo PHP incluído pela vulnerabilidade LFI. |
| `Pasted image 20261011132254.png` | `07-acesso-inicial.png` | Terminal após a tentativa de obter acesso inicial por shell reversa. |
| `Pasted image 20261011132357.png` | `08-enumeracao-web.png` | Terminal listando arquivos encontrados no diretório da aplicação web. |
| `Pasted image 20261011133841.png` | `09-arquivos-autenticacao.png` | Terminal com a inspeção dos arquivos de autenticação da aplicação. |
| `Pasted image 20261011133956.png` | `10-upgrade-pty.png` | Terminal com a criação de um pseudo-terminal e a troca de usuário. |
| `Pasted image 20261011134105.png` | `11-user-flag.png` | Terminal durante a localização do arquivo user.txt do usuário. |
| `Pasted image 20261011134155.png` | `12-grupo-lxd.png` | Terminal mostrando os grupos do usuário, incluindo lxd. |
| `Pasted image 20261011135141.png` | `13-transferencia-alpine.png` | Terminal transferindo a imagem Alpine para a máquina do laboratório. |
| `Pasted image 20261011135405.png` | `14-importacao-alpine.png` | Terminal com a listagem da imagem Alpine importada no LXD. |
| `Pasted image 20261011135513.png` | `15-configuracao-container.png` | Terminal com comandos de configuração do container e montagem do sistema de arquivos. |
| `Pasted image 20261011135559.png` | `16-acesso-container.png` | Terminal executando comandos no container LXD e verificando a montagem. |
| `Pasted image 20261011135930.png` | `17-root-flag.png` | Terminal mostrando o acesso ao caminho da flag root.txt por meio do sistema de arquivos montado. |

## Exemplo Markdown

```md
![Terminal com resultados de varreduras Nmap identificando os serviços HTTP e TFTP.](/images/writeups/included/01-nmap-reconhecimento.png)
```

Revisar as capturas antes da publicação para ocultar qualquer informação sensível que possa estar visível.
