---
title: Meow
description: Acesso root por Telnet sem senha após reconhecimento básico da máquina.
platform: Hack The Box
os: Linux
difficulty: Very Easy
category: starting-point
tier: '0'
status: published
image: /images/machines/meow.png
imageAlt: 'Avatar da máquina Meow: gato laranja em uma moldura roxa.'
tags: [Hack The Box, Starting Point, Tier 0]
techniques: [OpenVPN, Nmap, Telnet, Autenticação insegura]
date: 2026-11-09
---

## Introdução

A Meow é uma máquina de dificuldade **Very Easy (Muito Fácil)** do Hack The Box, pertencente ao Starting Point — Tier 0.

Neste laboratório, vamos aprender a estabelecer uma conexão VPN com a rede do Hack The Box, realizar um reconhecimento básico dos serviços disponíveis e acessar a máquina utilizando o protocolo Telnet.

O principal ponto explorado é uma configuração insegura de autenticação, que permite acessar o sistema como `root` sem fornecer uma senha.

## Conexão à VPN do Hack The Box

Inicialmente, precisamos nos conectar à VPN do Hack The Box para conseguir acessar a máquina-alvo.

O HTB utiliza o OpenVPN, um software de código aberto para estabelecer conexões VPN. Para realizar a conexão, baixei o arquivo `start-point-us_1.ovpn` disponibilizado pela plataforma e executei o seguinte comando:

```bash
sudo openvpn start-point-us_1.ovpn
```

**Observação:** o nome do arquivo `.ovpn` pode variar de acordo com a configuração disponibilizada pelo Hack The Box.

![Comando de conexão com o arquivo OpenVPN executado no terminal](/images/writeups/meow/01-comando-openvpn.png)

Após executar o comando, o terminal exibe as informações de conexão. A mensagem `Initialization Sequence Completed` indica que a inicialização da VPN foi concluída com sucesso.

![Saída do OpenVPN com a mensagem Initialization Sequence Completed](/images/writeups/meow/02-vpn-conectada.png)

## Verificando a conectividade com o alvo

Para verificar se conseguimos alcançar a máquina-alvo pela VPN, utilizei o comando `ping`:

```bash
ping -c 4 <IP_DO_ALVO>
```

- `-c 4`: limita o teste ao envio de quatro solicitações ICMP, evitando que ele continue indefinidamente.

![Resultado do ping com quatro pacotes recebidos e nenhuma perda](/images/writeups/meow/03-teste-ping.png)

O resultado mostrou que os quatro pacotes ICMP receberam resposta da máquina-alvo, sem perda de pacotes. Isso indica que conseguimos estabelecer comunicação com o alvo pela VPN.

## Reconhecimento e enumeração com Nmap

Agora que estamos conectados à VPN do HTB e verificamos a comunicação com a máquina-alvo, vamos procurar portas TCP abertas para identificar possíveis serviços disponíveis.

Para isso, utilizei o Nmap com o seguinte comando:

```bash
nmap -p- --min-rate 5000 -T4 <IP_DO_ALVO>
```

**Explicação do comando:**

- `-p-`: realiza a varredura das 65.535 portas TCP.
- `--min-rate 5000`: solicita uma taxa mínima de envio de 5.000 pacotes por segundo, buscando acelerar a varredura.
- `-T4`: utiliza um perfil de temporização mais agressivo para reduzir o tempo da análise.
- `<IP_DO_ALVO>`: representa o endereço da máquina do laboratório.

Como estamos em um laboratório autorizado do Hack The Box, optei por uma varredura mais agressiva para acelerar a identificação das portas abertas. Em outras palavras, entre uma abordagem discreta e outra mais barulhenta, escolhi a segunda.

![Resultado da varredura Nmap mostrando a porta 23 TCP aberta](/images/writeups/meow/04-varredura-portas-nmap.png)

O resultado indicou que a porta **23/TCP**, normalmente associada ao Telnet, estava aberta.

Para investigar o serviço mais a fundo, continuei com o Nmap:

```bash
nmap -sC -sV -p 23 <IP_DO_ALVO>
```

**Explicação do comando:**

- `-sC`: executa os scripts padrão do Nmap Scripting Engine (NSE), buscando informações adicionais sobre o serviço.
- `-sV`: tenta identificar o serviço em execução e sua versão.
- `-p 23`: direciona a análise à porta 23/TCP.

![Enumeração Nmap identificando Linux telnetd na porta 23 e informações do sistema Linux](/images/writeups/meow/05-enumeracao-telnet-nmap.png)

A enumeração identificou o serviço como `Linux telnetd`, além de apresentar informações que indicam um sistema Linux. O resultado não revelou uma versão específica do kernel.

## Acesso ao servidor via Telnet

Com a porta 23 aberta e o serviço Telnet identificado, tentei estabelecer uma conexão:

```bash
telnet <IP_DO_ALVO>
```

![Conexão Telnet estabelecida com a tela de login Hack The Box](/images/writeups/meow/06-login-telnet.png)

Ao estabelecer a conexão, o serviço Telnet apresentou uma solicitação de login. Como o objetivo era investigar possíveis credenciais padrão ou configurações inseguras de autenticação, testei o usuário `root`.

Para minha surpresa, o sistema permitiu o acesso sem solicitar uma senha. Isso indicou que a máquina estava configurada de maneira insegura, permitindo acesso privilegiado sem autenticação por senha.

![Terminal após login como root, mostrando o prompt root@Meow](/images/writeups/meow/07-acesso-root.png)

Após obter acesso ao sistema, utilizei o comando `whoami` para confirmar com qual usuário estava autenticado:

```bash
whoami
```

![Saída do comando whoami confirmando o usuário root](/images/writeups/meow/08-confirmacao-whoami.png)

O comando retornou `root`, confirmando que a sessão estava sendo executada com os privilégios desse usuário.

## Localização da flag e conclusão

Com acesso ao sistema como `root`, o próximo objetivo era localizar a flag da máquina.

Para isso, utilizei o comando `ls` para listar os arquivos e diretórios disponíveis no local em que estava:

```bash
ls
```

Após identificar o arquivo `flag.txt`, utilizei o comando `cat` para visualizar seu conteúdo:

```bash
cat flag.txt
```

![Terminal com listagem do arquivo flag.txt e comando cat preparado para leitura](/images/writeups/meow/09-localizacao-flag.png)

A captura mostra a localização do arquivo `flag.txt` e o comando para lê-lo, mas **não exibe o conteúdo da flag**. Com a leitura da flag, concluí a máquina Meow do Hack The Box.

O principal aprendizado deste laboratório foi compreender como uma configuração insegura de autenticação pode permitir acesso privilegiado a um sistema, mesmo sem explorar uma vulnerabilidade complexa.
